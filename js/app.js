/* ===== Dummy data (replace with API calls later) ===== */
const av = n => `https://i.pravatar.cc/100?img=${n}`;
const ph = s => `https://picsum.photos/seed/${s}/800/450`;
const ME = JSON.parse(localStorage.getItem('me') || 'null') || {name:'Alex Morgan',bio:'Coffee, code and weekend hikes.',avatar:av(12)};
const USERS = [
 {id:1,name:'Priya Sharma',avatar:av(5)},{id:2,name:'Rahul Verma',avatar:av(15)},
 {id:3,name:'Sara Khan',avatar:av(9)},{id:4,name:'Tom Becker',avatar:av(33)},
 {id:5,name:'Neha Patil',avatar:av(47)},{id:6,name:'Omar Ali',avatar:av(52)}];
const GROUPS = ['Web Developers','Nashik Hikers','Photography Club'];
let POSTS = [
 {id:1,user:USERS[0],text:'Sunrise at Anjaneri hill was worth the early alarm! #hiking #nashik',img:ph('hill'),likes:24,comments:['Stunning!','Take me next time'],time:'2h ago'},
 {id:2,user:USERS[1],text:'Just shipped my first Bootstrap project. #webdev #learning',likes:12,comments:['Congrats!'],time:'5h ago'},
 {id:3,user:USERS[2],text:'Weekend food trail — best misal pav in town. #food',img:ph('food'),likes:41,comments:[],time:'1d ago'},
 {id:4,user:ME,text:'Hello everyone, glad to be here. #welcome',likes:3,comments:[],time:'2d ago'}];
const TRENDS = [['#webdev','1.2k'],['#nashik','980'],['#hiking','640'],['#food','520'],['#learning','310']];
const NOTIFS = [
 {icon:'heart-fill text-danger',text:'Priya Sharma liked your post',time:'5m ago',unread:true},
 {icon:'chat-fill text-primary',text:'Rahul Verma commented: "Nice work!"',time:'1h ago',unread:true},
 {icon:'person-plus-fill text-success',text:'Sara Khan sent you a friend request',time:'3h ago',unread:true},
 {icon:'envelope-fill text-warning',text:'New message from Tom Becker',time:'1d ago',unread:false}];

const $ = (s,r=document)=>r.querySelector(s);
const esc = t => t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tag = t => esc(t).replace(/#(\w+)/g,'<a href="#" class="text-decoration-none">#$1</a>');

/* ===== Navbar + footer (shared on every page) ===== */
function layout(active){
 const links=[['index.html','Home','house'],['profile.html','Profile','person'],['friends.html','Friends','people'],['messages.html','Messages','chat-dots'],['notifications.html','Notifications','bell']];
 $('#nav').innerHTML=`<nav class="navbar navbar-expand-lg navbar-dark sticky-top"><div class="container">
 <a class="navbar-brand" href="index.html"><i class="bi bi-chat-heart-fill me-1"></i>Connectly</a>
 <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nv" aria-label="Menu"><span class="navbar-toggler-icon"></span></button>
 <div class="collapse navbar-collapse" id="nv">
  <ul class="navbar-nav me-auto">${links.map(l=>`<li class="nav-item"><a class="nav-link ${l[1]===active?'active':''}" href="${l[0]}"><i class="bi bi-${l[2]}"></i> ${l[1]}</a></li>`).join('')}</ul>
  <div class="position-relative me-lg-3 my-2 my-lg-0"><input id="q" class="form-control" placeholder="Search users, posts, groups" autocomplete="off"><div id="searchResults" class="list-group shadow d-none"></div></div>
  <button class="btn btn-outline-light" id="logout"><i class="bi bi-box-arrow-right"></i> Logout</button>
 </div></div></nav>`;
 $('#foot').innerHTML=`<footer class="mt-5 py-4"><div class="container text-center">
 <div class="mb-2"><a href="#" class="mx-2">About Us</a><a href="#" class="mx-2">Privacy Policy</a><a href="#" class="mx-2">Terms of Service</a><a href="#" class="mx-2">Contact Us</a></div>
 <div class="fs-4 mb-2"><a href="https://facebook.com" target="_blank" rel="noopener" class="mx-2" aria-label="Facebook"><i class="bi bi-facebook"></i></a><a href="https://twitter.com" target="_blank" rel="noopener" class="mx-2" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a><a href="https://instagram.com" target="_blank" rel="noopener" class="mx-2" aria-label="Instagram"><i class="bi bi-instagram"></i></a><a href="https://linkedin.com" target="_blank" rel="noopener" class="mx-2" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a></div>
 <small>&copy; 2026 Connectly. All rights reserved.</small></div></footer>`;
 $('#logout').onclick=()=>{ if(confirm('Log out of Connectly?')){localStorage.clear();alert('You have been logged out.');location.href='index.html';} };
 const q=$('#q'),box=$('#searchResults');
 q.oninput=()=>{const v=q.value.trim().toLowerCase();if(!v){box.classList.add('d-none');return;}
  const r=[...USERS.filter(u=>u.name.toLowerCase().includes(v)).map(u=>`<a class="list-group-item" href="profile.html"><i class="bi bi-person"></i> ${u.name}</a>`),
   ...POSTS.filter(p=>p.text.toLowerCase().includes(v)).map(p=>`<a class="list-group-item" href="index.html"><i class="bi bi-card-text"></i> ${esc(p.text.slice(0,50))}…</a>`),
   ...GROUPS.filter(g=>g.toLowerCase().includes(v)).map(g=>`<a class="list-group-item" href="#"><i class="bi bi-collection"></i> ${g}</a>`)];
  box.innerHTML=r.join('')||'<div class="list-group-item text-muted">No results found</div>';box.classList.remove('d-none');};
 document.addEventListener('click',e=>{if(!e.target.closest('#q,#searchResults'))box.classList.add('d-none');});
}

/* ===== Posts ===== */
function postHTML(p){return `<div class="card mb-3" data-id="${p.id}"><div class="card-body">
 <div class="d-flex align-items-center mb-2"><img class="avatar me-2" src="${p.user.avatar}" alt=""><div><strong>${p.user.name}</strong><div class="small text-muted">${p.time}</div></div></div>
 <p>${tag(p.text)}</p>${p.img?`<img class="post-img mb-2" src="${p.img}" alt="Post image">`:''}${p.video?`<video class="post-img mb-2" src="${p.video}" controls></video>`:''}
 <div class="small text-muted mb-2"><span class="lc">${p.likes}</span> likes · <span class="cc">${p.comments.length}</span> comments</div><hr class="my-2">
 <div class="d-flex gap-2"><button class="btn btn-sm btn-light flex-fill like"><i class="bi bi-hand-thumbs-up"></i> Like</button>
 <button class="btn btn-sm btn-light flex-fill cm"><i class="bi bi-chat"></i> Comment</button>
 <button class="btn btn-sm btn-light flex-fill share"><i class="bi bi-share"></i> Share</button></div>
 <div class="cbox d-none mt-3"><div class="clist small">${p.comments.map(c=>`<div class="bg-light rounded p-2 mb-1">${esc(c)}</div>`).join('')}</div>
 <div class="input-group input-group-sm mt-2"><input class="form-control cin" placeholder="Write a comment"><button class="btn btn-brand csend">Send</button></div></div>
 </div></div>`;}
function renderPosts(list,el){
 el.innerHTML=list.length?list.map(postHTML).join(''):'<div class="text-center text-muted py-4">No posts yet. Share your first one.</div>';
}
function bindPosts(el){
 el.onclick=e=>{const c=e.target.closest('.card[data-id]');if(!c)return;const p=POSTS.find(x=>x.id==c.dataset.id),b=e.target.closest('button');if(!b)return;
  if(b.classList.contains('like')){b.classList.toggle('liked');p.likes+=b.classList.contains('liked')?1:-1;$('.lc',c).textContent=p.likes;}
  if(b.classList.contains('cm'))$('.cbox',c).classList.toggle('d-none');
  if(b.classList.contains('share')){navigator.clipboard?.writeText(location.origin+'#post'+p.id);alert('Post link copied to clipboard.');}
  if(b.classList.contains('csend')){const i=$('.cin',c),v=i.value.trim();if(!v)return;p.comments.push(v);$('.clist',c).insertAdjacentHTML('beforeend',`<div class="bg-light rounded p-2 mb-1">${esc(v)}</div>`);$('.cc',c).textContent=p.comments.length;i.value='';}};
}

/* ===== Page logic ===== */
const pages={
 home(){
  const feed=$('#feed');renderPosts(POSTS,feed);bindPosts(feed);
  $('#trends').innerHTML=TRENDS.map(t=>`<li class="list-group-item d-flex justify-content-between"><a href="#" class="text-decoration-none">${t[0]}</a><span class="text-muted small">${t[1]} posts</span></li>`).join('');
  $('#postForm').onsubmit=e=>{e.preventDefault();const t=$('#postText').value.trim(),f=$('#postFile').files[0];if(!t&&!f)return;
   const p={id:Date.now(),user:ME,text:t,likes:0,comments:[],time:'Just now'};
   if(f){const u=URL.createObjectURL(f);f.type.startsWith('video')?p.video=u:p.img=u;}
   POSTS.unshift(p);renderPosts(POSTS,feed);e.target.reset();};
 },
 profile(){
  const draw=()=>{$('#pName').textContent=ME.name;$('#pBio').textContent=ME.bio;$('#pAvatar').src=ME.avatar;};draw();
  $('#pFriends').innerHTML=USERS.map(u=>`<div class="col-4 text-center mb-2"><img class="avatar" src="${u.avatar}" alt=""><div class="small">${u.name.split(' ')[0]}</div></div>`).join('');
  const mine=POSTS.filter(p=>p.user===ME||p.user.name===ME.name);renderPosts(mine,$('#pPosts'));bindPosts($('#pPosts'));
  $('#eName').value=ME.name;$('#eBio').value=ME.bio;
  $('#editForm').onsubmit=e=>{e.preventDefault();ME.name=$('#eName').value.trim()||ME.name;ME.bio=$('#eBio').value.trim();
   localStorage.setItem('me',JSON.stringify(ME));draw();bootstrap.Modal.getInstance($('#editModal')).hide();};
 },
 friends(){
  const reqs=[USERS[2],USERS[5]],fr=[...USERS.slice(0,2),USERS[3],USERS[4]];
  const row=(u,btns)=>`<div class="d-flex align-items-center border-bottom py-2" data-n="${u.id}"><img class="avatar me-3" src="${u.avatar}" alt=""><strong class="flex-grow-1">${u.name}</strong>${btns}</div>`;
  const draw=()=>{
   $('#reqs').innerHTML=reqs.length?reqs.map(u=>row(u,'<button class="btn btn-sm btn-brand me-1 acc">Accept</button><button class="btn btn-sm btn-outline-secondary dec">Decline</button>')).join(''):'<p class="text-muted mb-0">No pending requests.</p>';
   $('#flist').innerHTML=fr.map(u=>row(u,'<a href="messages.html" class="btn btn-sm btn-outline-success me-1">Message</a><button class="btn btn-sm btn-outline-danger rm">Unfriend</button>')).join('');
   $('#fcount').textContent=fr.length;};
  document.addEventListener('click',e=>{const r=e.target.closest('[data-n]');if(!r)return;const id=+r.dataset.n,i=reqs.findIndex(u=>u.id===id);
   if(e.target.closest('.acc')){fr.push(reqs.splice(i,1)[0]);draw();}
   if(e.target.closest('.dec')){reqs.splice(i,1);draw();}
   if(e.target.closest('.rm')){fr.splice(fr.findIndex(u=>u.id===id),1);draw();}});
  draw();
 },
 messages(){
  const chats=USERS.slice(0,4).map(u=>({name:u.name,avatar:u.avatar,msgs:[{me:false,t:'Hey! How are you?'}]}));
  chats.push({name:'Weekend Hikers (group)',avatar:av(60),msgs:[{me:false,t:'Priya: Trek on Sunday?'}]});
  let cur=0;
  const list=()=>{$('#chats').innerHTML=chats.map((c,i)=>`<button class="list-group-item list-group-item-action d-flex align-items-center ${i===cur?'active':''}" data-i="${i}"><img class="avatar me-2" src="${c.avatar}" alt="">${c.name}</button>`).join('');};
  const show=()=>{const c=chats[cur];$('#chatTitle').textContent=c.name;$('#box').innerHTML=c.msgs.map(m=>`<div class="msg ${m.me?'me':'them'}">${esc(m.t)}</div>`).join('');$('#box').scrollTop=1e6;list();};
  $('#chats').onclick=e=>{const b=e.target.closest('[data-i]');if(b){cur=+b.dataset.i;show();}};
  $('#sendForm').onsubmit=e=>{e.preventDefault();const v=$('#msgIn').value.trim();if(!v)return;const c=chats[cur];c.msgs.push({me:true,t:v});$('#msgIn').value='';show();
   setTimeout(()=>{c.msgs.push({me:false,t:'Got it, thanks!'});if(chats[cur]===c)show();},900);};
  $('#newGroup').onclick=()=>{const n=prompt('Group name?');if(n&&n.trim()){chats.push({name:n.trim()+' (group)',avatar:av(64),msgs:[{me:false,t:'Group created. Say hi!'}]});cur=chats.length-1;show();}};
  show();
 },
 notifications(){
  const draw=()=>{$('#nlist').innerHTML=NOTIFS.map(n=>`<div class="list-group-item notif ${n.unread?'unread':''} d-flex align-items-center"><i class="bi bi-${n.icon} fs-4 me-3"></i><div class="flex-grow-1">${n.text}<div class="small text-muted">${n.time}</div></div></div>`).join('');};
  $('#markAll').onclick=()=>{NOTIFS.forEach(n=>n.unread=false);draw();};draw();
 }
};
document.addEventListener('DOMContentLoaded',()=>{
 const p=document.body.dataset.page;layout({home:'Home',profile:'Profile',friends:'Friends',messages:'Messages',notifications:'Notifications'}[p]);pages[p]();
});
