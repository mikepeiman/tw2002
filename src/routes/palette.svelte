<script>
  let colors = ["primary-blue", "primary-royal", "accent-orange", "secondary-redblack", "secondary-blueblack"];
  let tones = ["dark", "normal", "light"];
  let alphas = ["low", "medium", "high"];
</script>

<style lang="scss" global>
  @import "src/styles/palette.scss";

  .palette-title {
    background: color(sky_dark_high, true);
    color: $test;
    padding: .75rem;
    border-radius: .75rem;
  }
  .palette-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(150px, 350px));
    grid-gap: 1rem;
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 1rem;
    font-weight: 700;
    justify-content: center;
    text-align: left;
    text-transform: uppercase;
  }

  .colors-container {
    display: flex;
    flex-direction: column;
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
  }
  .tone {
    font-size: 0.75rem;
  }
  .alpha {
    font-size: 0.5rem;
  }

  $swatch-radius: 5rem;
  .swatch {
    width: $swatch-radius;
    height: $swatch-radius;
    border-radius: $swatch-radius;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .thanks-to-freddy {
    color: color(sky_dark_high, true);
  }
</style>

<svelte:head>
  <title>Color Palette Generator</title>
</svelte:head>

<div>
  <h1 class="palette-title">Color Palette Generator</h1>
  <p class="thanks-to-freddy">
    Huge thanks to
    <a
      href="https://ferdychristant.com/mastering-color-palettes-with-sass-ed124b1f8920#.lf2yof825">
      Freddy Christant
    </a>
    for the code and inspiration!
  </p>
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
</div>
