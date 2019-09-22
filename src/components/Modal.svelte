<script>
  import { onMount } from "svelte";
  // export let modalContent;
  export let buttonContent, buttonId, instances, command;
  export let keyTrigger = '';
  export let modalId, modal, modalOpener, modalContent, modalOverlay

  // let btns, modal;
  $: command
  $: count = localStorage.setItem("modalCount", JSON.stringify(0));
  $: ids = localStorage.setItem("modalIds", JSON.stringify([]))
  $: buttons = localStorage.setItem("modalButtons", JSON.stringify([]))
  $: setIds = () => {
    console.log(`inside reactive setIds, buttons:`)
    console.log(buttons)
  }
  $: modal = () => {
    console.log(`bound :this modal called`)
  }

  onMount(() => {
    let props = Object.entries($$props)
    // console.log(`props: ${props}`)
    count = JSON.parse(localStorage.getItem('modalCount'))
    count++
    console.log(`Modal.svelte onMount count: ${count}`)
    console.log(`^^^^^^^^^^^^^^^^^^^^^^^ Modal.svelte onMount keyTrigger: ${keyTrigger}`)
    localStorage.setItem("modalCount", JSON.stringify(count));

    ids = JSON.parse(localStorage.getItem('modalIds'))
    console.log(`buttonIds from getItem: ${ids}`)
    ids.push(buttonId)
    localStorage.setItem("modalIds", JSON.stringify(ids))
    console.log(`Modal.svelte buttonIds: ${ids}`)

    buttons = document.querySelectorAll(".modal_opener");
    localStorage.setItem("modalButtons", JSON.stringify(buttons))

    // modal = document.querySelector(`#${buttonId}`);
    console.log(`Modal.svelte onMount. props:`);
    console.log(`${modalContent} ${buttonContent} ${buttonId} + instances:`);
    console.log(instances)
        console.log(`modal ##########################################`);
    console.dir(modal);

    props.forEach(prop => {
      console.log(`props loop: key: ${prop[0]} val: ${prop[1]}`)
      if(prop[0] === "buttonId") { 
        // setListeners(prop[1])
        console.log(`called setListners for button ID ### ${prop[1]}`)
         }

    })
    // btns.forEach((btn, index) => {
    //   btn.setAttribute('id',buttonId )
    //   console.log(`btn at index ${index}`);
    //   console.log(`buttonId at index ${ids[index]}`);
    //   console.dir(btn);
    //   btn.addEventListener("click", openModal);
    // });
  });

  function handleKeydown(e) {
    console.log(`handleKeydown called from Modal component svelte:window directive with $$$ e ${e}, id ${modalId}, current keyTrigger ${keyTrigger}`)
    console.log(e)
    if(e.key === keyTrigger) {
      console.log(`trigger ${keyTrigger} matches modal ${modalId}`)
      toggleModal(modalId)
    }
  }

  function setListeners(id, keyTrigger) {
    let el = document.getElementById(id)
    el.addEventListener('click', toggleModal(id))
    keyTrigger ? el.addEventListener('keydown', handleKeydown()) : false
  }  

  function attachModalListeners(modalElm) {
    modalElm
      .querySelector(".close_modal")
      .addEventListener("click", closeModal());
    modalElm.querySelector(".overlay").addEventListener("click", closeModal());
  }

  function detachModalListeners(modalElm) {
    modalElm
      .querySelector(".close_modal")
      .removeEventListener("click", closeModal(id));
    modalElm
      .querySelector(".overlay")
      .removeEventListener("click", closeModal(id));
  }

  function openModal(e) {
    modal = document.getElementById(modalId)
    var currentState = modal.classList.contains("hidden");
    console.log(`modal classlist includes hidden: ${currentState}`);
    console.log(`openModal() modalId ${modalId}, id ${e}, and this:`)
    console.log(modal)
      modal.classList.toggle("hidden");
      attachModalListeners(modal);

  }
      function closeModal(e) {
        modal = document.getElementById(modalId)

        // modal = e.target.nextElementSibling
        var currentState = modal.classList.contains("hidden");
        modal.classList.toggle("hidden");
        detachModalListeners(modal);
        console.log(`closeModal called`);
        console.log(modal)
  }

  function toggleModal() {
    modal = document.getElementById(modalId)
    modal.classList.toggle("hidden");
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
<!-- {#each Object.entries($$props) as [key, val]} -->

<svelte:window on:keydown={handleKeydown} />
<button bind:this={modalOpener} on:click={toggleModal} class="modal_opener" id={buttonId}>
  <slot name="buttonContent">{buttonContent}</slot>
</button>

<div bind:this={modal} class="modal hidden" id={modalId} on:click={toggleModal}>
  <div bind:this={modalOverlay} class="overlay"  />
  <div class="modal_content">
    <h2>MODAL</h2>
    <slot name="modalContent">
      <div class="modal-content">{modalContent}</div>
    </slot>
    <button title="Close" class="close_modal">
      X
    </button>
  </div>
</div>
<!-- {/each} -->
