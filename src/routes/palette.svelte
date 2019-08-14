<script>
  let colors = ["jungle", "olive", "sky", "gold", "sunset", "saddle"];
  let tones = ["dark", "normal", "light"];
  let alphas = ["low", "medium", "high"];
</script>

<style lang="scss">
  @import "src/styles/palette.scss";

  .palette-title {
    background: color(sky_dark_high, true);
    background: color(sky_light_high, true);
    color: $test;
  }

  .swatch {
    width: 25px;
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
<ul>
  {#each colors as color}
    <li class="swatch mp_{color}">{color}</li>
    <ul>
      {#each tones as tone}
        <li class="swatch mp_{color}_{tone}">{color}_{tone}</li>
        <ul>
          {#each alphas as alpha}
            <li class="swatch mp_{color}_{tone}_{alpha}">
              {color}_{tone}_{alpha}
            </li>
          {/each}
        </ul>
      {/each}
    </ul>
  {/each}
</ul>
