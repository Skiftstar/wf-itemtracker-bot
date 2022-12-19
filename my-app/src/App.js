import { useEffect, useState } from 'react';
import './App.css';
import DropdownMenu from './components/DropdownMenu/DropdownMenu';
import Navbar from './components/Navbar/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import WeaponScreen from './components/WeaponScreen/WeaponScreen';


function App() {
  const axios = require('axios');

  const primaries = [], secondaries = [], melees = [], warframes = [], archwings = [], archguns = [], archmelees = [], companions = []
  const options = [{ arr: primaries, name: "primaries" }, { arr: secondaries, name: "secondaries" }, { arr: melees, name: "melees" }, { arr: warframes, name: "warframes" }, { arr: archwings, name: "archwings" }, { arr: archguns, name: "archguns" }, { arr: archmelees, name: "archmelees" }, { arr: companions, name: "companions" }]
  let itemsMap = new Map();
  let loaded = false;

  const craftedItems = require('./data/crafted.json');
  const completedItems = require('./data/completed.json');
  const config = require('./data/config.json');

    const [currSelected, setCurrSelected] = useState(warframes)

  useEffect(() => {
    loadStuff();
    loaded = true;
  })

  const changeWindow = (newItem) => {
    options.every(option => {
        if (option.name.toLowerCase() === newItem.toLowerCase()) {
            setCurrSelected(option.arr)
            return false;
        }
        return true;
    })
  }

  const loadStuff = () => {

    if (loaded) return;

    let primariesTemp = []
    let secondariesTemp = []
    let meleesTemp = []
    let warframesTemp = []
    let archwingsTemp = []
    let archgunsTemp = []
    let archmeleesTemp = []
    let companionsTemp = []

    const obj = [{ arr: primariesTemp, categories: ["Primary"] }, { arr: secondariesTemp, categories: ["Secondary"] }, { arr: meleesTemp, categories: ["Melee"] }, { arr: warframesTemp, categories: ["Warframes"] }, { arr: archwingsTemp, categories: ["Archwing"] }, { arr: archgunsTemp, categories: ["Arch-Gun"] }, { arr: archmeleesTemp, categories: ["Arch-Melee"] }, { arr: companionsTemp, categories: ["Pets", "Sentinels"] }]
    const toSkip = ['Glyphs', 'Sigils', 'Enemy', 'Quests', 'Mods', 'Fish', 'Skins', 'Node', 'Relics']

    axios
        .get('https://api.warframestat.us/items')
        .then(res => {
            console.log(`statusCode: ${res.status}`);
            const categories = [];
            if (res.data) {
                const apiResponse = res.data;
                res.data.forEach(item => {
                    if (!categories.includes(item.category)) {
                        categories.push(item.category)
                    }

                    if (toSkip.includes(item.category)) {
                        return;
                    }
    
                    if (item.components) {
                        itemsMap.set(item.uniqueName, item.components)
                    }

                    obj.forEach(object => {
                        if (object.categories.includes(item.category)) {
                            object.arr.push(item)
                            return;
                        }
                    })
                })
            }
            filter()
            console.log('Loaded Data!');
        })
        .catch(error => {
            console.log("Error on startup! Retrying...")
            console.error(error);
            loadStuff();
        });
    function filter() {
        primariesTemp.forEach(item => {
            if (completedItems.primaries.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.primaries.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            primaries.push(itemCopy)
        })

        secondariesTemp.forEach(item => {
            if (completedItems.secondaries.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.secondaries.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            secondaries.push(itemCopy)
        })

        meleesTemp.forEach(item => {
            if (completedItems.melees.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.melees.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            melees.push(itemCopy)
        })

        warframesTemp.forEach(item => {
            if (completedItems.warframes.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.warframes.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            warframes.push(itemCopy)
        })

        archwingsTemp.forEach(item => {
            if (completedItems.archwings.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.archwings.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            archwings.push(itemCopy)
        })

        archgunsTemp.forEach(item => {
            if (completedItems.archguns.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.archguns.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            archguns.push(itemCopy)
        })

        archmeleesTemp.forEach(item => {
            if (completedItems.archmelees.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.archmelees.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            archmelees.push(itemCopy)
        })

        companionsTemp.forEach(item => {
            if (completedItems.companions.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.companions.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            companions.push(itemCopy)
        })

        console.log(warframes)
    }
}

  return (
    <div className="App">
      <div className=''>
        <DropdownMenu
          changeWindow={changeWindow}
          items={['Warframes', 'Primaries', 'Secondaries', 'Melees', 'Archwings', 'Archguns', 'Archmelees', 'Companions']}
        />
      </div>
      <div className='mt-[5%]'>
        <WeaponScreen
            items={currSelected}
        />
      </div>
    </div>
  );
}

export default App;
