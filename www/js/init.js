import productJson from './DUMMY_DATA.json' assert { type: 'json' };
import catJson from './DUMMY_CDATA.json' assert { type: 'json' };
import brandJson from './DUMMY_BDATA.json' assert { type: 'json' };
const dbDom = document.getElementById('db');
const catDom = document.getElementById('cat');
const brandDom = document.getElementById('brand');
brandDom.onclick = brandC;
dbDom.onclick = db;
catDom.onclick = () => cat(catJson);
catShowDom.onclick = listCat;
// Content-Type application/json
function db() {
  for (const p of productJson) {
    fetch('http://localhost:8080/admin/product/create', {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTllMjZmNmI0NzU2M2NhNzVmMGE4YiIsImlhdCI6MTY4ODg1NTI5NiwiZXhwIjoxNjkxNDQ3Mjk2fQ.w4kGXykeEK5P79gXN9UQAgMlZPypOtVx2GuiAdPw9si2FBI0AXlHORi19R18AbjiJQNXGhG7O5USU8ic19GkUCFFTSgl4TE-5jnPHl7QU5vZNLG3zSZAIzHQV0vPtljAktKtBmhLkd-3MQZXNl6-s6Qi7rMuTfrmwmVFxGP9XrORay7CHtYLXfeunQZ3sIXzAzZYLUzdUBfMX-2B9Nl5PVEiVGZ786lIYPQ1RdOf1EzcyHIS02dh7KGLxDV4E2XAH6ph_Sr5_UdwhI9vka8gULFymUyuEB9Ifm5HyjurYAMnYqkQPi4cU_7O-Dq_-dq6iJMfez21qQauWnohQH_9-A',
      },
      method: 'POST',
      body: JSON.stringify(p),
    })
      .then(r => r.json())
      .then(console.log)
      .catch(err => {
        console.log(err);
      });
  }
  console.log('Done');
}
function brandC() {
  for (const p of brandJson) {
    fetch('http://localhost:8080/admin/brand/create', {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTllMjZmNmI0NzU2M2NhNzVmMGE4YiIsImlhdCI6MTY4ODg1NTI5NiwiZXhwIjoxNjkxNDQ3Mjk2fQ.w4kGXykeEK5P79gXN9UQAgMlZPypOtVx2GuiAdPw9si2FBI0AXlHORi19R18AbjiJQNXGhG7O5USU8ic19GkUCFFTSgl4TE-5jnPHl7QU5vZNLG3zSZAIzHQV0vPtljAktKtBmhLkd-3MQZXNl6-s6Qi7rMuTfrmwmVFxGP9XrORay7CHtYLXfeunQZ3sIXzAzZYLUzdUBfMX-2B9Nl5PVEiVGZ786lIYPQ1RdOf1EzcyHIS02dh7KGLxDV4E2XAH6ph_Sr5_UdwhI9vka8gULFymUyuEB9Ifm5HyjurYAMnYqkQPi4cU_7O-Dq_-dq6iJMfez21qQauWnohQH_9-A',
      },
      method: 'POST',
      body: JSON.stringify(p),
    })
      .then(r => r.json())
      .then(console.log)
      .catch(err => {
        console.log(err);
      });
  }
  console.log('Done');
}

function cat(catj, id) {
  console.log(id);
  const url = !id
    ? 'http://localhost:8080/admin/category/create'
    : 'http://localhost:8080/admin/category/' + id + '/add-sub';
  // console.log(url);
  for (const c of catj) {
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTllMjZmNmI0NzU2M2NhNzVmMGE4YiIsImlhdCI6MTY4ODg1NTI5NiwiZXhwIjoxNjkxNDQ3Mjk2fQ.w4kGXykeEK5P79gXN9UQAgMlZPypOtVx2GuiAdPw9si2FBI0AXlHORi19R18AbjiJQNXGhG7O5USU8ic19GkUCFFTSgl4TE-5jnPHl7QU5vZNLG3zSZAIzHQV0vPtljAktKtBmhLkd-3MQZXNl6-s6Qi7rMuTfrmwmVFxGP9XrORay7CHtYLXfeunQZ3sIXzAzZYLUzdUBfMX-2B9Nl5PVEiVGZ786lIYPQ1RdOf1EzcyHIS02dh7KGLxDV4E2XAH6ph_Sr5_UdwhI9vka8gULFymUyuEB9Ifm5HyjurYAMnYqkQPi4cU_7O-Dq_-dq6iJMfez21qQauWnohQH_9-A',
      },
      method: 'POST',
      body: JSON.stringify({ name: c.name, description: c.description }),
    })
      .then(r => r.json())
      .then(data => {
        if (c.subcategories) {
          cat(c.subcategories, data.data.id);
        }
      });
  }
}

function listCat() {
  $main.innerHTML = '';
  $page.innerHTML = '';
  fetch(`http://localhost:8080/api/product/list?`)
    .then(d => d.json())
    .then(p => {
      console.log(p);
      if (p.status !== 'success') {
        main.innerHTML = '<h1 class="error">' + p.message + '<h1>';
        return;
      }
      p.data.products.forEach((p, i) => {
        $main.innerHTML += `<div class="element"><h2 class="title">${i + 1} - ${p.name}<h2>\n<p>${
          p.description
        }`;
      });
    })
    .catch(err => ($main.innerHTML = '<h1 class="error">' + err.message + '<h1>'));
}
