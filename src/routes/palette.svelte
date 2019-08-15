<script>
  let colors = ["jungle", "olive", "sky", "gold", "sunset", "saddle"];
  let tones = ["dark", "normal", "light"];
  let alphas = ["low", "medium", "high"];
</script>

<style lang="scss" global>
  @import "src/styles/palette.scss";

  .palette-title {
    background: color(sky_dark_high, true);
    background: color(sky_light_high, true);
    color: $test;
  }
  .palette-container {
    display: grid;
    grid-template-columns: repeat(6, minmax(50px, 150px));
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 0.8rem;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
  }

  .colors-container {
  }
  .tones-container {
    display: grid;
    grid-template-columns: repeat(3, minmax(30px, 50px));
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 0.6rem;
    font-weight: 400;
    text-align: left;
    text-transform: uppercase;
  }
  .alphas-container {
    display: flex;
    flex-direction: column;
    // grid-template-columns: repeat(3, minmax(30px, 50px));
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 0.5rem;
    font-weight: 300;
    text-align: left;
    text-transform: uppercase;
  }
  .swatch {
    width: auto;
    height: auto;
  }
</style>

<svelte:head>
  <title>Color Palette Generator</title>
</svelte:head>

<div>
  <h1 class="palette-title">Color Palette Generator</h1>
  <p>
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
        <span class="swatch mp-paint-color-{color}">{color}</span>
        <div class="tones-container">
          {#each tones as tone}
            <li>
              <span class="swatch mp-paint-color-{color}-{tone}">{tone}</span>
              <div class="alphas-container">
                {#each alphas as alpha}
                  <span class="swatch mp-paint-color-{color}-{tone}-{alpha}">
                    {alpha}
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
