class View {
  constructor() {
    this.app = document.getElementById("app");
    this.app.classList.add("container");
    this.searchDiv = this.createElement("div", "rep-search");
    this.searchInput = this.createElement("input", "rep-input");
    this.searchInput.placeholder = "search git repos";

    this.repoContainer = this.createElement("ul", "autocomplete-list");
    this.repoListWrapper = this.createElement("div", "rep-list");
    this.repoList = this.createElement("ul", "reps");

    this.repoListWrapper.append(this.repoList);
    this.searchDiv.append(this.repoContainer);
    this.searchDiv.append(this.searchInput);

    this.app.append(this.searchDiv);
    this.app.append(this.repoListWrapper);
  }

  createElement(elTag, elClass) {
    const element = document.createElement(elTag);
    if (elClass) {
      element.classList.add(elClass);
    }
    return element;
  }

  renderRepoItem(data) {
    const repoItem = this.createElement('li', 'autocomplete-item');
    repoItem.textContent = data.name;
    this.repoContainer.append(repoItem);

    repoItem.addEventListener('click', this.renderRepoCard.bind(this, data))
  }

  renderRepoCard(data) {
    const card = this.createElement('li', 'reps__item');
    const name = data.name,
        owner = data.owner.login,
        stars = data.stargazers_count;

    card.innerHTML = `<div class="info">
                    <p class="info__name">Name: ${name}</p>
                    <p class="info__owner">Owner: ${owner}</p>
                    <p class="info__stars">Stars: ${stars}</p>
                </div>
                <button class="btn-delete">
                    &#9587;
                </button>`;

    this.repoList.append(card);

    card.addEventListener('click', function (e) {
     if(e.target.classList == 'btn-delete') card.remove()
    })
    this.searchInput.value = '';
    this.repoContainer.innerHTML = '';
  }
}

class Search {
  constructor(view) {
    this.view = view;
    this.view.searchInput.addEventListener("keyup", this.debounce(this.searchRepos.bind(this), 500));
  }

  async searchRepos() {
    const value = this.view.searchInput.value
    if (value) {
      return await fetch(`https://api.github.com/search/repositories?q=${value}+in:name&per_page=5`)
          .then((res) => {
            if (res.ok) {
              this.view.repoContainer.innerHTML = ''
              res.json().then(rep => {
                rep.items.forEach(r => this.view.renderRepoItem(r))
              })
            }
          })
    } else this.view.repoContainer.innerHTML = '';
  }

  debounce(fn, time) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      const fnCall = (...args) => {
        fn.apply(this, args);
      };
      timer = setTimeout(fnCall, time);
    };
  }
}
new Search(new View());
