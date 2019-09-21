<script>
  import { onMount } from "svelte";
  export let modalContent;
  export let buttonContent;
  export let buttonId;
  export let instances;

  let btns, modal;
  let counter = 1
  onMount(() => {
    console.log(`Modal.svelte onMount count: ${counter}`)
    counter++
    btns = document.querySelectorAll(".modal_opener");

    // modal = document.querySelector(`#${buttonId}`);
    console.log(`Modal.svelte onMount. props:`);
    console.log(`${modalContent} ${buttonContent} ${buttonId} + instances:`);
    console.log(instances)
    // console.log(`this`);
    // console.dir(this);
    btns.forEach(btn => {
          btn.setAttribute('id',buttonId )
      console.log(`btn`);
      console.dir(btn);
      btn.addEventListener("click", openModal);
    });
  });

  function attachModalListeners(modalElm) {
    modalElm
      .querySelector(".close_modal")
      .addEventListener("click", closeModal);
    modalElm.querySelector(".overlay").addEventListener("click", closeModal);
  }

  function detachModalListeners(modalElm) {
    modalElm
      .querySelector(".close_modal")
      .removeEventListener("click", closeModal);
    modalElm
      .querySelector(".overlay")
      .removeEventListener("click", closeModal);
  }

    function openModal(e) {
    modal = e.target.nextElementSibling
    // modal = e.target.parentElement
    var currentState = modal.classList.contains("hidden");
    console.log(`modal classlist includes hidden: ${currentState}`);
    console.log(`openModal click e`);
    console.log(e);
        console.log(`openModal click e.target`);
    console.dir(e.target);
    console.log(`openModal click e.target.nextElementSibling`);
    console.dir(e.target.nextElementSibling);
        console.log(`openModal click e.target.parentElement`);
    console.dir(e.target.parentElement);
    
    // If modal is visible, hide it. Else, display it.

      modal.classList.toggle("hidden");
      attachModalListeners(modal);

  }
      function closeModal(e) {
    // modal = e.target.nextElementSibling
    modal = e.target.parentElement
    var currentState = modal.classList.contains("hidden");
    console.log(`modal classlist includes hidden: ${currentState}`);
    console.log(`closeModal click e`);
    console.log(e);
        console.log(`closeModal click e.target`);
    console.dir(e.target);
    console.log(`closeModal click e.target.nextElementSibling`);
    console.dir(e.target.nextElementSibling);
        console.log(`closeModal click e.target.parentElement`);
    console.dir(e.target.parentElement);
    
    // If modal is visible, hide it. Else, display it.
      modal.classList.toggle("hidden");
      // modal.style.display = "none";
      detachModalListeners(modal);

  }

  // function toggleModal(e) {
  //   // modal = e.target.nextElementSibling
  //   modal = e.target.parentElement
  //   var currentState = modal.classList.contains("hidden");
  //   console.log(`modal classlist includes hidden: ${currentState}`);
  //   console.log(`toggleModal click e`);
  //   console.log(e);
  //       console.log(`toggleModal click e.target`);
  //   console.dir(e.target);
  //   console.log(`toggleModal click e.target.nextElementSibling`);
  //   console.dir(e.target.nextElementSibling);
  //       console.log(`toggleModal click e.target.parentElement`);
  //   console.dir(e.target.parentElement);
    
  //   // If modal is visible, hide it. Else, display it.
  //   if (currentState) {
  //     // modal.style.display = "block";
  //     modal.classList.toggle("hidden");
  //     attachModalListeners(modal);
  //   } else {
  //     modal.classList.toggle("hidden");
  //     // modal.style.display = "none";
  //     detachModalListeners(modal);
  //   }
  // }
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
    transition: all 0.25s;
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
    transition: all 0.25s;
  }

  .modal .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 995;
    background: rgba(0, 0, 0, 0.5);
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
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.7);
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

<button class="modal_opener">
  <slot name="buttonContent">{buttonContent}</slot>
</button>

<div class="modal hidden" id="{buttonId}">
  <div class="overlay" />
  <div class="modal_content">
    <!-- <h2>{}</h2> -->
    <slot name="modalContent">
      <div class="modal-content">{modalContent}</div>
    </slot>
    <button title="Close" class="close_modal">
      <i class="fas fa-times" />
    </button>
  </div>
</div>
