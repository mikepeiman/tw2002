<script>
  
  import Airtable from "airtable";
  import { onMount } from "svelte";
  
  const base = new Airtable({apiKey: 'keyoLbEc7OzfEfj68'}).base('appFmmP7xud6lzPXw')
  
  const ships = async function getAirtableData() {
    base('ships').select({
      view: 'Grid view'
    }).firstPage(function(err, records) {
      if (err) { console.error(err); return; }
      records.forEach(function(record) {
          console.log('Retrieved', record.get('Name'));
      });
    });
  }
  
  onMount(() => {
        ships.then(() => {
        console.log(`airtable data ${data}`)
      })
  })

  
  // end official Airtable API implementation
</script>