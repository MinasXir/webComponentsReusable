// Create a class for the element
class TextComponent extends HTMLElement {
  constructor() {
    super();
    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `<h1>Projects or whatever</h1><div class="gridBoxes"> </div>`;
    const style = document.createElement("style");
    style.textContent = `
    .gridBoxes {
      display: grid;
      grid-template-columns: ${
        window.location.pathname === "/about-page"
          ? `repeat(auto-fit, minmax(400px, 1fr));`
          : `repeat(auto-fit, minmax(300px, 1fr));`
      }
      grid-gap: 20px;
    }
    .item {
      background-color: rgb(255, 255, 255);
      height: 100%;
      position: relative;
      border-radius: 15px;
      height: 35vh;
      box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
        0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
        0 22.3px 17.9px rgba(0, 0, 0, 0.072),
        0 41.8px 33.4px rgba(0, 0, 0, 0.086);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .hidden {
      display: none;
    }
    .block {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      width: 0%;
      height: 100%;
      z-index: 1;
      top: 0;
      background-color: rgb(53, 53, 53);
      color: ivory;
      animation: fadeInWidth 0.3s ease-in-out forwards;
      white-space: nowrap;
    }
    .block > * {
      opacity: 0;
      animation: fadeInOpacity 1s ease-in-out forwards;
    }
    button {
      position: absolute;
      top: 10%;
      right: 5%;
      background-color: transparent;
      border: none;
      outline: none;
    }
    button[close]{
        color:white;
    }
    @keyframes fadeInWidth {
      100% {
        width: 100%;
        border-radius: 15px;
      }
    }
    @keyframes fadeInOpacity {
      100% {
        opacity: 1;
      }
    }
 :host {   
  display:${window.location.pathname === "/about-page" ? `block` : `block`};
  color: ${window.location.pathname === "/about-page" ? `cyan` : `orange`};
  width: 90%;
  background: ${window.location.pathname === "/about-page" ? `green` : `yellow`};
  margin:0 auto;
  height: auto;
}
    `;
    // Attach the created element to the shadow dom
    shadow.appendChild(style);
  }

  openClose() {
    //button open
    const AllOpenButtons = Array.from(
      this.shadowRoot.querySelectorAll("button[open]")
    );
    AllOpenButtons.forEach(function (item) {
      item.addEventListener("click", (event) => {
        event.target.parentNode.style.opacity = "0";
        event.target.parentNode.parentNode.childNodes[1].className = "block";
      });
    });
    //button close
    const AllCloseButtons = Array.from(
      this.shadowRoot.querySelectorAll("button[close]")
    );
    AllCloseButtons.forEach(function (item) {
      item.addEventListener("click", (event) => {
        event.target.parentNode.parentNode.childNodes[0].style.opacity = "1";
        event.target.parentNode.className = "hidden";
      });
    });
  }

  //function to render the array of objects that is fetched
  renderBoxes(data) {
    return `
          ${data
            .map((item) => {
              return `<div class="item"><div><button open>OPEN</button><p>${item.main}</p></div><div class="hidden" ><button close>CLOSE</button> <p>${item.hidden}</p></div></div>`;
            })
            .join(" ")}`;
  }
  //store data from API json to session storage to avoid extra requests
  fetchData() {
    const PutDataIn = this.shadowRoot.querySelector(".gridBoxes");
    //reuse component in different route("/about") and render other data:)
    if (
      window.location.pathname === "/about-page" &&
      !sessionStorage.getItem("aboutData")
    ) {
      fetch("./myArrayTwo.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          sessionStorage.setItem("aboutData", JSON.stringify(json.myArray));
          PutDataIn.innerHTML = this.renderBoxes(json.myArray);
          this.openClose();
        });
    }
    if (
      window.location.pathname === "/about-page" &&
      sessionStorage.getItem("aboutData")
    ) {
      PutDataIn.innerHTML = this.renderBoxes(
        JSON.parse(sessionStorage.getItem("aboutData"))
      );
      this.openClose();
    }
    if (
      window.location.pathname === "/contact-page" &&
      !sessionStorage.getItem("contactData")
    ) {
      fetch("./myArray.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          sessionStorage.setItem("contactData", JSON.stringify(json.myArray));
          const PutDataIn = this.shadowRoot.querySelector(".gridBoxes");
          PutDataIn.innerHTML = this.renderBoxes(json.myArray);
          this.openClose();
        });
    }
    if (
      window.location.pathname === "/contact-page" &&
      sessionStorage.getItem("contactData")
    ) {
      PutDataIn.innerHTML = this.renderBoxes(
        JSON.parse(sessionStorage.getItem("contactData"))
      );
      this.openClose();
    }
  }
  connectedCallback() {
    this.fetchData();
  }
}

// Define the new element
customElements.define("text-component", TextComponent);
