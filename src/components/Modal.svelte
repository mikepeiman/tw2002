<script>
  import { onMount } from "svelte";

  export let buttonContent, buttonId, instances, command, modalId, modal, modalOpener, modalContent, modalOverlay
  export let keyTrigger = '';

  // $: command
  // $: count = localStorage.setItem("modalCount", JSON.stringify(0));
  // $: ids = localStorage.setItem("modalIds", JSON.stringify([]))
  // $: buttons = localStorage.setItem("modalButtons", JSON.stringify([]))

  // onMount(() => {
    // let props = Object.entries($$props)
  // });

  function handleKeydown(e) {
    console.log(`handleKeydown called from Modal component svelte:window directive with $$$ e ${e}, id ${modalId}, current keyTrigger ${keyTrigger}`)
    console.log(e)
    if(e.key === keyTrigger) {
      console.log(`trigger ${keyTrigger} matches modal ${modalId}`)
      toggleModal(modalId)
    }
  }

  function toggleModal() {
    modal = document.getElementById(modalId)
    let currentState = modal.classList.contains("hidden");
    // currentState ?  attachModalListeners(modal) : detachModalListeners(modal)
    modal.classList.toggle("hidden");
  }

  // function attachModalListeners(modalElm) {
  //   modalElm
  //     .querySelector(".close_modal")
  //     .addEventListener("click", toggleModal());
  //   modalElm.querySelector(".overlay").addEventListener("click", toggleModal());
  // }

  // function detachModalListeners(modalElm) {
  //   modalElm
  //     .querySelector(".close_modal")
  //     .removeEventListener("click", toggleModal());
  //   modalElm
  //     .querySelector(".overlay")
  //     .removeEventListener("click", toggleModal());
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

<svelte:window on:keydown={handleKeydown} />
<button on:click={toggleModal} class="modal_opener" id={buttonId}>
  <slot name="buttonContent">{buttonContent}</slot>
</button>

<div class="modal hidden" id={modalId} >
  <div class="overlay" on:click={toggleModal} />
  <div class="modal_content">
    <h2>MODAL</h2>
    <slot name="modalContent">
      <div class="modal-content">{modalContent}</div>
    </slot>
    <button title="Close" class="close_modal" on:click={toggleModal}>
      X
    </button>
  </div>
</div>

