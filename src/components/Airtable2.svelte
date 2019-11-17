<script>
//   import builtins from "rollup-plugin-node-builtins";
//   import resolve from "rollup-plugin-node-resolve";
// import replace from "rollup-plugin-replace";
// import commonjs from "rollup-plugin-commonjs";
  // import { onMount } from "svelte";
  import Airtable from 'airtable';

var base = new Airtable({apiKey: 'keyoLbEc7OzfEfj68'}).base('appFmmP7xud6lzPXw');

base('ships').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 3,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        console.log('Retrieved', record.get('Name'));
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});

  // onMount(() => {
  //      getData();
  // })

  
  // end official Airtable API implementation
</script>