// Create a class for the element
class MainPage extends HTMLElement {
  constructor() {
    super();
    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });
    //create h1 title if exists, if not delete it
    const title = document.createElement("h1");
    if (this.hasAttribute("title")) {
      title.textContent = this.getAttribute("title");
      shadow.appendChild(title);
    } else {
      shadow.innerHTML = `<h2>Select users from the list bellow</h2><br>
      ${JSON.parse(this.getAttribute("test"))
        .map(
          (user) =>
            `
            <div><input class="messageCheckbox" type="checkbox" value="${user.name}">${user.name}</div>
            `
        )
        .join("")}<br><button disabled>Get Users</button> `;
      title.remove();
    }
    const style = document.createElement("style");
    style.textContent = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
:host {
  display:${window.location.pathname === "/about-page" ? `block` : `block`};
  color: ${window.location.pathname === "/about-page" ? `cyan` : `orange`};
  width: 90%;
  background: ${window.location.pathname === "/about-page" ? `grey` : `cyan`};
  margin:0 auto;
  height: ${window.location.pathname === "/about-page" ? `auto` : `90`}vh;
}
div{
  margin:10px;
  padding:20px;
  background-color:"transparent";
  border: 1px solid black;
  overflow:hidden;
  color:red;
  transition:0.3s;
}
.checked{
  background-color:white;
  color:black;
}
input[type=checkbox]{
  transform: scale(150 , 3.5);
  position: absolute;
  opacity:0;
  left: 300px;
}
p , h3{
  display:inline-block;
  float:right;
  padding;20px;
}


`;
    // Attach the created element to the shadow dom
    shadow.appendChild(style);
  }
  //push checked values into an empty array
  getCheckedUsers() {
    const checkboxes = this.shadowRoot.querySelectorAll("input[type=checkbox]");
    const users = [];
    for (let i = 0; i < checkboxes.length; i += 1) {
      const checkbox = checkboxes[i];
      if (checkbox.checked) {
        users.push({ name: checkbox.value });
      }
    }
    alert(JSON.stringify(users));
  }
  //if at least one checkbox is checked , enable button
  validateUsers() {
    const checkboxes = this.shadowRoot.querySelectorAll("input[type=checkbox]");
    const checkOne = Array.prototype.slice
      .call(checkboxes)
      .some((x) => x.checked);
    this.shadowRoot.querySelector("button").disabled = true;
    if (checkOne) {
      this.shadowRoot.querySelector("button").disabled = false;
    }
  }

  connectedCallback() {
    const counter = document.createElement("h3");
    let users = [];
    if (!this.hasAttribute("title")) {
      const checkboxes = this.shadowRoot.querySelectorAll(
        "input[type=checkbox]"
      );
      checkboxes.forEach((item) => {
        const checkedText = document.createElement("p");
        checkedText.textContent = "Checked";
        item.addEventListener("change", (event) => {
          event.path[1].className === ""
            ? ((event.path[1].className = "checked"),
              event.path[1].appendChild(checkedText),
              users.push(event.target))
            : ((event.path[1].className = ""),
              event.path[1].removeChild(checkedText),
              (users.length -= 1));
          counter.textContent = `users checked:${users.length}`;
          users.length > 0
            ? this.shadowRoot.appendChild(counter)
            : this.shadowRoot.removeChild(counter);
          this.validateUsers();
        });
      });
      const button = this.shadowRoot.querySelector("button");
      button.addEventListener("click", () => {
        this.getCheckedUsers();
      });
    }
  }
}

// Define the new element
customElements.define("main-page", MainPage);
