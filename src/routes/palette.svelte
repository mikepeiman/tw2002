<script>
  let colors = [
    "primary-blue",
    "primary-royal",
    "accent-orange",
    "secondary-redblack",
    "secondary-blueblack"
  ];
  let tones = ["dark", "normal", "light"];
  let alphas = ["low", "medium", "high"];
  let backgrounds = [
    "africa-animal-animals-417142.jpg",
    "cascade-cliff-clouds-356831.jpg",
    "cascade-clouds-cool-wallpaper-210186.jpg",
    "perspective.jpg"
  ];
  let logos = [
    "purpose-logo-compass-rose-v1.png",
    "purpose-logo-compass-rose-v1.2.png",
    "purpose-logo-compass-rose-v1.4.png",
    "purpose-logo-compass-rose-v1.5.png",
    "purpose-logo-compass-rose-v1.6.png",
    "purpose-logo-compass-rose-v1.6b.png",
    "purpose-logo-compass-rose-v1.6c.png",
    "purpose-logo-compass-rose-v1.6d.png",
    "purpose-logo-compass-rose-v1.6e.png",
    "purpose-logo-compass-rose-v1.6f.png",
    "purpose-logo-compass-rose-v1.6g.png",
    "purpose-logo-compass-rose-v1.6h.png",
    "purpose-logo-compass-rose-v1.6i.png",
    "purpose-logo-compass-rose-v1.6j.png",
    "purpose-logo-compass-rose-v1.6k.png",
    "purpose-logo-compass-rose-v1.7.png",
    "purpose-logo-compass-rose-v1.7b.png",
    "purpose-logo-compass-rose-v1.7c.png",
    "purpose-logo-compass-rose-v1.7d.png",
    "purpose-logo-compass-rose-v1.7e.png",
    "purpose-logo-compass-rose-v1.7f.png",
    "purpose-logo-compass-rose-v1.7g.png"
  ];
  let topFiveLogos = [
    "purpose-logo-compass-rose-v1.7d.png",
    "purpose-logo-compass-rose-v1.png",
    "purpose-logo-compass-rose-v1.7e.png",
    "purpose-logo-compass-rose-v1.7f.png",
    "purpose-logo-compass-rose-v1.7g.png"
  ];
  let l = colors.length;
  function loopArray(outer, inner) {
    let sequence = outer + inner;
    sequence > 4 ? (sequence -= 5) : sequence;
    return sequence;
  }
</script>

<style lang="scss" global>
  @import "src/styles/palette.scss";

  .palette-title {
    background: color(primary-royal, true);
    color: color(accent-orange, true);
    padding: 0.75rem;
    border-radius: 0.75rem;
    font-family: "Archivo Black";
  }
  h1.purpose-heading {
    font-family: "Cinzel","Red Hat Display";
    text-align: center;
    font-size: 3rem;
  }
  h2.purpose-subheading {
    font-family: "Libre Caslon Text";
    text-align: center;
    font-size: 2rem;
  }

  .palette-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(25vw, 50vw));
    grid-gap: 1rem;
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 1rem;
    font-weight: 700;
    justify-content: center;
    text-align: left;
    text-transform: uppercase;
    &.contrast {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-top: 4rem;
    }
    &.image-bg {
      background-size: cover;
      background-attachment: fixed;
    }
  }

  .colors-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    &.contrast {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      align-items: stretch;
      &.image-bg {
        grid-template-columns: repeat(5, 1fr);
      }
    }
  }
  .within-colors-container {
    display: grid;
    grid-template-rows: 2fr 3fr;
    padding: 2rem;
  }

  .tones-container {
    display: flex;
    flex-direction: row;
    // grid-template-columns: repeat(3, minmax(30px, 50px));
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 0.9rem;
    font-weight: 400;
    text-align: left;
    text-transform: uppercase;
    &.contrast {
      font-size: 0.75rem;
    }
  }
  .alphas-container {
    display: flex;
    flex-direction: row;
    // grid-template-columns: repeat(3, minmax(30px, 50px));
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 0.75rem;
    font-weight: 300;
    text-align: left;
    text-transform: uppercase;
  }

  .color {
    font-size: 1rem;
    font-weight: 700;
    &.contrast {
      height: 3rem;
    }
    &.subcolor {
      padding: 1rem;
    }
  }
  .tone {
    font-size: 0.75rem;
    &.contrast {
      font-size: 0.45rem;
    }
  }
  .alpha {
    font-size: 0.5rem;
    &.contrast {
      font-size: 0.25rem;
    }
  }

  $swatch-radius: 9vw;
  $swatch-small: 3vw;
  .swatch {
    width: $swatch-radius;
    height: $swatch-radius;
    border-radius: $swatch-radius;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    &.contrast {
      width: $swatch-small;
      height: $swatch-small;
      border-radius: 0;
    }
  }

  .thanks-to-freddy {
    color: color("primary-royal", true);
    font-family: "Quicksand";
  }
  .logo {
    // width: 10vw;
    // height: auto;
    background-size: cover;
  }

  .logo-container {
    display: grid;
    background: #333;
    padding: 1rem;
  }
</style>

<svelte:head>
  <title>Color Palette Generator</title>
</svelte:head>

<div>
  <h1 class="palette-title">Color Palette Generator</h1>
  <h1 class="purpose-heading">PURPOSE</h1>
  <h2 class="purpose-subheading">Investment Group</h2>
  <p class="thanks-to-freddy">
    Huge thanks to
    <a
      href="https://ferdychristant.com/mastering-color-palettes-with-sass-ed124b1f8920#.lf2yof825">
      Freddy Christant
    </a>
    for the code and inspiration!
  </p>

  <div
    class="logo-container"
    style="grid-template-columns: repeat({logos.length}, 1fr);">
    {#each logos as logo}
      <div
        class="logo"
        style="background-image: url('{logo}'); width: {80 / logos.length}vw;
        height: {80 / logos.length}vw;" />
    {/each}
  </div>
  <div
    class="logo-container"
    style="grid-template-columns: repeat({topFiveLogos.length}, 1fr);">
    {#each topFiveLogos as logo}
      <div
        class="logo large"
        style="background-image: url('{logo}'); width: {80 / topFiveLogos.length}vw;
        height: {80 / topFiveLogos.length}vw;" />
    {/each}
  </div>

  <div class="palette-container">
    {#each colors as color}
      <li class="colors-container">
        <span class="color">{color}</span>
        <div>
          {#each tones as tone}
            <li class="tones-container">
              <span class="swatch tone mp-paint-color-{color}-{tone}">
                <div class="tone">{tone}</div>
              </span>
              <div class="alphas-container">
                {#each alphas as alpha}
                  <span class="swatch mp-paint-color-{color}-{tone}-{alpha}">
                    <div class="alpha">{alpha} alpha</div>
                  </span>
                {/each}
              </div>
            </li>
          {/each}
        </div>
      </li>
    {/each}
  </div>
  <div class="palette-container contrast">
    {#each colors as mainColor}
      <li class="colors-container contrast">
        <span class="color subcolor mp-paint-color-{mainColor}">
          {mainColor}
        </span>
        {#each colors as subColor}
          <li
            class="within-colors-container contrast mp-paint-color-{mainColor}">
            <span class="color contrast">{subColor}</span>
            <div>
              {#each tones as tone}
                <li class="tones-container contrast">
                  <span
                    class="swatch contrast tone mp-paint-color-{subColor}-{tone}" />
                  <div class="alphas-container">
                    {#each alphas as alpha}
                      <span
                        class="swatch contrast mp-paint-color-{subColor}-{tone}-{alpha}" />
                    {/each}
                  </div>
                </li>
              {/each}
            </div>
          </li>
        {/each}
      </li>
    {/each}
  </div>
  {#each backgrounds as bg}
    <div
      class="palette-container contrast image-bg"
      style="background-image: url({bg});">
      {bg}
      {#each colors as mainColor, mainIteration}
        <li class="colors-container contrast image-bg">
          {#each colors as subColor, subIteration}
            <li class="within-colors-container">
              <span
                class="color contrast mp-text-color-{`${colors[loopArray(mainIteration, subIteration)]}`}">
                {colors[loopArray(mainIteration, subIteration)]}
              </span>
              <div>
                {#each tones as tone}
                  <li class="tones-container contrast">
                    <span
                      class="swatch contrast tone mp-paint-color-{`${colors[loopArray(mainIteration, subIteration)]}`}-{tone}" />
                    <div class="alphas-container">
                      {#each alphas as alpha}
                        <span
                          class="swatch contrast mp-paint-color-{`${colors[loopArray(mainIteration, subIteration)]}`}-{tone}-{alpha}" />
                      {/each}
                    </div>
                  </li>
                {/each}
              </div>
            </li>
          {/each}
        </li>
      {/each}
    </div>
  {/each}
</div>
