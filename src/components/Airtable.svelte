<script>
  
  // import Airtable from "airtable";
  import { onMount } from "svelte";
  import axios from "axios";
  
  // const base = new Airtable({apiKey: 'keyoLbEc7OzfEfj68'}).base('appFmmP7xud6lzPXw')
  
let API_URL = "https://api.airtable.com"
let BASE = "appFmmP7xud6lzPXw"
let TABLE = "ships"
let API_KEY = "keyoLbEc7OzfEfj68"
let records
const proxyurl = "https://cors-anywhere.herokuapp.com/"

  function getData() {
      axios({
        method: "get",
        url: proxyurl + API_URL + "/" + BASE + "/" + TABLE + "/",
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }).then(res => {
        console.log('AirtableModule getData results:')
        console.log(res.data.records)
        records = res.data.records;
        // $store.commit('change', records)
      });
    }

  function postData(data) {
      console.log('postData called in AirtableModule')
      axios({
        method: "post",
        url: API_URL + "/" + BASE + "/" + TABLE + "/",
        headers: {
          Authorization: `Bearer ${API_KEY}`
        },
        data: data
      }).then(res => {
                console.log('AirtableMOdule postData results:')
        console.log(res)
        // records = res.data.records;
        records.push(res.data)
      });
    }

    function deleteRecord() {
      axios({
        method: "delete",
        url: API_URL + BASE + TABLE + recordToDelete,
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }).then(res => {
        console.log('AirtableMOdule deleteData results:')
        console.log(res.data.deleted)
        if(res.data.deleted) {
          records = records.filter(item => {
            return item.id !== recordToDelete
          })
        } else {
          console.log(`There appears to be an error attempting to delete ${recordToDelete}`)
        }
        // records = res.data.records;
        // $store.commit('change', records)
      });
    }

  // const ships = async function getAirtableData() {
  //   base('ships').select({
  //     view: 'Grid view'
  //   }).firstPage(function(err, records) {
  //     if (err) { console.error(err); return; }
  //     records.forEach(function(record) {
  //         console.log('Retrieved', record.get('Name'));
  //     });
  //   });
  // }
  
  onMount(() => {
       getData();
  })

  
  // end official Airtable API implementation
</script>