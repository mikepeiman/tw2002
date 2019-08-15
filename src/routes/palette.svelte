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
  .colors-container {
    display: grid;
    grid-template-columns: repeat(6, minmax(50px, 150px));
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: .8rem;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
  }
  .tones-container {
    display: grid;
    grid-template-columns: repeat(3, minmax(50px, 150px));
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: .6rem;
    font-weight: 400;
    text-align: left;
    text-transform: uppercase;
  }
  .alphas-container {
    display: grid;
    grid-template-columns: repeat(3, minmax(50px, 150px));
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: .5rem;
    font-weight: 300;
    text-align: left;
    text-transform: uppercase;
  }
  .swatch {
    width: auto;
    height: 25px;
  }
</style>

<svelte:head>
  <title>Color Palette Generator</title>
</svelte:head>
<h1 class="palette-title">Color Palette Generator</h1>

<p>
  Huge thanks to
  <a
    href="https://ferdychristant.com/mastering-color-palettes-with-sass-ed124b1f8920#.lf2yof825">
    Freddy Christant
  </a>
  for the code and inspiration!
</p>
<ul class="colors-container">
  {#each colors as color}
    <li class="swatch mp-paint-color-{color}">
      {color}
      <ul class="tones-container">
        {#each tones as tone}
          <li class="swatch mp-paint-color-{color}-{tone}">
            {`${color}-${tone}`}
            <ul class="alphas-container">
              {#each alphas as alpha}
                <li class="swatch mp-paint-color-{color}-{tone}-{alpha}">
                  {`${color}-${tone}-${alpha}`}
                </li>
              {/each}
            </ul>
          </li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>
