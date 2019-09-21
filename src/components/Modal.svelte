<script>
  import { onMount } from "svelte";

  let btn, modal
  onMount(() => {
       btn = document.getElementById("modal_opener");
  modal = document.querySelector(".modal");
  console.log(`modal`)
  console.dir(modal)
  btn.addEventListener("click", toggleModal);
  })

  function attachModalListeners(modalElm) {
    modalElm
      .querySelector(".close_modal")
      .addEventListener("click", toggleModal);
    modalElm.querySelector(".overlay").addEventListener("click", toggleModal);
  }

  function detachModalListeners(modalElm) {
    modalElm
      .querySelector(".close_modal")
      .removeEventListener("click", toggleModal);
    modalElm
      .querySelector(".overlay")
      .removeEventListener("click", toggleModal);
  }

  function toggleModal() {
    var currentState = modal.classList.contains('hidden')
    console.log(`modal classlist includes hidden: ${currentState}`)
    // If modal is visible, hide it. Else, display it.
    if (currentState) {
      // modal.style.display = "block";
      modal.classList.toggle('hidden')
      attachModalListeners(modal);
    } else {
      modal.classList.toggle('hidden')
      // modal.style.display = "none";
      detachModalListeners(modal);
    }
  }


</script>

<style>
#modal_opener {
  background: #3498db;
  padding: 4px 0;
  margin-bottom: 1rem;
  /* position: fixed; */
  /* left: 50%; */
  /* top: 50%; */
  /* transform: translateX(-50%) translateY(-50%); */
  border-radius: 3px;
  /* font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; */
  text-align: center;
  text-transform: uppercase;
  color: #fff;
  font-size: 1rem;
  padding: 10px 20px;
  height: auto;
  border: none;
  transition: all 0.2s ease;
}

.hidden {
  visibility: hidden;
  opacity: 0;
}

#modal_opener:hover {
  cursor: pointer;
  background: #469fdb;
}

.modal {
  position: fixed;
    /* visibility: visible; */
  /* opacity: 1; */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 990;
}

.modal .overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 995;
  background: rgba(0,0,0,0.5);
}

.modal .modal_content {
  z-index: 999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90%;
  overflow: auto;
  background: #fff;
  padding: 20px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.7);
  text-align: center;
  border-radius: 4px;
  width: 520px; /* This just a default width */
}

.modal .modal_content > h2 {
  font-size: 28px;
  font-weight: 200;
  margin: 20px 0 40px;
  text-align: center;
}

.modal .modal_content .buttons_wrapper {
  padding: 20px;
}

.modal .close_modal {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.5;
  background: none;
  border: none;
  transition: opacity 0.2s ease;
}

.modal .close_modal:hover {
  opacity: 0.9;
}
</style>

<button id="modal_opener">Click Me! I Don't Bite... 😛</button>

<div class="modal hidden" >
  <div class="overlay" />
  <div class="modal_content">
    <!-- Dynamic Section -->
    <h2>Told Ya!</h2>
    <!-- <iframe
      src="https://giphy.com/embed/l52CGyJ4LZPa0"
      width="480"
      height="273"
      frameBorder="0"
      class="giphy-embed"
      allowFullScreen />
    <p>
      <a href="https://giphy.com/gifs/sandler-sentences-sounding-l52CGyJ4LZPa0">
        via GIPHY
      </a>
    </p> -->
    <!-- End of Dynamic Section -->
    <button title="Close" class="close_modal">
      <i class="fas fa-times" />
    </button>
  </div>
</div>

