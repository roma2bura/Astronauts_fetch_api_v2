const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

function getProfiles(json) {
  const profiles = json.people.map( person => {
    return fetch(wikiUrl + person.name)
            .then (response => response.json())
            .catch (err => console.log('Error fetching Wikipedia:', err));      
  }); 
  return Promise.allSettled(profiles);
}

function generateHTML(data) {
  data.map( person => {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    if (person.value.type === "standard") {
      section.innerHTML = `
        <img src=${person.value.thumbnail.source}>
        <h2>${person.value.title}</h2>
        <p>${person.value.description}</p>
        <p>${person.value.extract}</p>
      `;
    }
  })

}

btn.addEventListener('click', (event) => {
  event.target.textContent = 'Loading...';
  fetch(astrosUrl)
    .then (response => response.json())
    .then(getProfiles)
    .then(generateHTML)
    .catch( err => {
      peopleList.innerHTML = '<h3>Something went wrong</h3>';
      console.log(err);
    })
    .finally(() => event.target.remove());

});