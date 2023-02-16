
export class GithubUser{
  static search(username){
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint).then(data => data.json()).then(({ login, name, public_repos, followers }) => ({
      login,
      name,
      public_repos,
      followers,
    }))
  }
}

export class Favorites{
  constructor(root){
    this.tbody = this.root.querySelector('table tbody')
    this.root = document.querySelector(root)
    this.load()
  }
  async add(username){
    const user = await GithubUser.search(username)
  }
  
  load(){
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  delete(user){
    const filteredEntries = this.entries.filter(entry => entry.login !== entry.login)
    this.entries = filteredEntries
    this.update()
  }
}

export class FavoritesView extends Favorites{
  constructor(root){
    super(root)
    this.update()
    this.onAdd()
  }

  onAdd(){
    const addButton = this.root.querySelector(".search button")
    addButton.onclick = () =>{
      const { value } = this.root.querySelector(".search input")
      this.add(value)
      console.log(value)
    }
  }

  update(){
   this.removeAllTr()
   this.entries.forEach(user =>{
    const row = this.createRow()
    
    row.querySelector(".user img").src = `https://github.com/${user.login}.png`
    row.querySelector(".user img").alt = `Imagem de ${user.name}`
    row.querySelector(".user p").textContent = user.name
    row.querySelector(".user span").textContent = user.login
    row.querySelector(".repositories").textContent = user.public_repos
    row.querySelector(".followers").textContent = user.followers
    row.querySelector(".remove").onclick = () =>{
      const isOK = confirm('Tem certeza que deseja deletar essa linha?')
      if(isOK){
        user.delete()
      }
    }

    
    this.tbody.append(row)
  })
  }

  createRow(){
    const tr = document.createElement("tr")
    tr.innerHTML = `
    <td class="user">
      <img src="https://avatars.githubusercontent.com/u/97984848?s=400&u=49beaad904f72a7e0f35f3e2c6e0306c6452a9a2&v=4" alt="">
      <a href="https://github.com/gugrando">
        <p>gugrando</p>
        <span>Gu grnado</span>
      </a>
    </td>
    <td class="repositories"></td>
    <td class="followers"></td>
    <td>
      <button class="remove">&times;</button>
    </td>
    `
    return tr
  }

  removeAllTr(){  
    this.tbody.querySelectorAll('tr')
    .forEach((tr) => {
      tr.remove()
    });
  }
}
