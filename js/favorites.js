import { GithubUser } from "./githubUser.js"

export class Favorites{
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
  }
  
  load(){
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }
  save(){
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
  }

  async add(username){
    try{
      const userExist = this.entries.find(entry => entry.login === username)

      if (userExist){
        throw new Error("User já cadastrado")
      }
      const user = await GithubUser.search(username)
      console.log(user)
      if(user.login === undefined){
        throw new Error("User não encontrado!")
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch(error){
      alert(error.message)
    } 
  }

  delete(user){
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
    this.entries = filteredEntries
    this.update()
    this.save()
  }

}

export class FavoritesView extends Favorites{
  constructor(root){
    super(root)
    
    this.tbody = this.root.querySelector('table tbody')
    
    this.update()
    this.onAdd()
  }
  

  onAdd(){
    const addButton = this.root.querySelector(".search button")
    addButton.onclick = () =>{
      const { value } = this.root.querySelector(".search input")
      this.add(value)
    }
  }

  update(){
   this.removeAllTr()
   this.entries.forEach(user =>{
    const row = this.createRow()
    
    row.querySelector(".user img").src = `https://github.com/${user.login}.png`
    row.querySelector(".user img").alt = `Imagem de ${user.name}`
    row.querySelector(".user a").href = `https://github.com/${user.login}`
    row.querySelector(".user p").textContent = user.name
    row.querySelector(".user span").textContent = user.login
    row.querySelector(".repositories").textContent = user.public_repos
    row.querySelector(".followers").textContent = user.followers
    row.querySelector(".remove").onclick = () =>{
      const isOK = confirm('Tem certeza que deseja deletar essa linha?')
      if(isOK){
        this.delete(user)
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
      <a target="_blank" href="https://github.com/gugrando">
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
