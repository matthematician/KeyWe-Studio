//import html2canvas from "html2canvas";

async function capturePreviewAsBlob(divElement, callback) {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  setTimeout(() => {
  html2canvas(divElement, {
    allowTaint: true, // allows cross-origin images
    useCORS: false,      // allows SVG images and external CSS
    backgroundColor: '#fff'  // preserves transparent backgrounds
  }).then((canvas) => {
    canvas.toBlob((blob) => {
      callback(blob);
    }, "image/png");
  });
}, 50); // slight delay to ensure all SVGs are rendered
}

async function loadDeliveryChargesFromCSV(csvUrl) {
  const response = await fetch(csvUrl);
  const csvText = await response.text();

  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());

  const townIndex = headers.indexOf("Town");
  const zoneIndex = headers.indexOf("Zone");
  const deliveryIndex = headers.indexOf("Delivery");

  const deliveryDict = {};

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map(c => c.trim());
    const town = cols[townIndex];
    const zone = cols[zoneIndex];
    const delivery = parseFloat(cols[deliveryIndex]);

    deliveryDict[town] = {
      zone: zone,
      delivery: delivery
    };
  }

  return deliveryDict;
}

const colors = [
      { name: 'Chrome Rose Gold', code: '#BA726D' },
      { name: 'Cameo Pink', code: '#E9CCC8' },
      { name: 'Chrome Red', code: '#C2463E' },
      { name: 'Standard Red', code: '#FF0000' },
      { name: 'Standard Orange', code: '#EF6B24' },
      { name: 'White Sand', code: '#D8C6B5' },
      { name: 'Chrome Gold', code: '#BF9855' },
      { name: 'Latte Brown', code: '#C39958' },
      { name: 'Goldenrod', code: '#FFD46E' },
      { name: 'Chrome White Gold', code: '#EFECE2' },     
      { name: 'Pastel Yellow', code: '#FBF8D2' },
      { name: 'Lime Green', code: '#8FC73E' },
      { name: 'Forest Green', code: '#218B21' },     
      { name: 'Sage / Tea Green', code: '#B2DDC3' },
      { name: 'Baby Blue', code: '#A0DAEB' },
      { name: 'Turquoise', code: '#37B9CA' },
      { name: 'Carolina Blue', code: '#49808B'},
      { name: 'Navy Blue', code: '#1F337D' },
      { name: 'Standard Blue', code: '#0000FF' },
      { name: 'Lavender / Lilac', code: '#C4B9D9' },
      { name: 'Plum Purple', code: '#5E1791' },
      { name: 'Baby Pink', code: '#F7CEDE' },
      { name: 'Flamingo Pink', code: '#F65B85' },
      { name: 'Standard Black', code: '#000000' },
      { name: 'Chrome Silver', code: '#B4B4B4' },
      { name: 'Fog Gray', code: '#D5D5D5' },
      { name: 'Standard White', code: '#FFFFFF' },
      { name: 'Macaron Assorted', code: '#FFFFFF' }
    ];

    function getColorCodeByName(name) {
      const match = colors.find(c => c.name === name);
      return match ? match.code : '#888888';
    }

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}


// Sample design metadata JSON
const allDesignMetadata = {
  "numberstack1.csv": {
    base_price: 60,
    subscription_price: 40,
    label: "Number Stack: 1",
    featured: true,
    accent_coords: [300, 240],
    backdrops_compatible: [1, 3]
  },
  "numberstack16.csv": {
    base_price: 80,
    subscription_price: 70,
    label: "Number Stack: 16",
    featured: true,
    accent_coords: [300, 240],
    backdrops_compatible: [1, 3]
  },
  "organic12.csv": {
    base_price: 120,
    subscription_price: 100,
    label: "Organic Garland 12ft",
    accent_coords: [180, 120],
    backdrops_compatible: [2, 4, 5]
  },
   "freestand9.csv": {
    base_price: 100,
    subscription_price: 80,
    label: "Freestanding Garland 9ft",
    accent_coords: [180, 120],
    backdrops_compatible: [2, 4, 5]
  },
   "crazytower.csv": {
    base_price: 100,
    subscription_price: 80,
    label: "Crazy Tower",
    accent_coords: [180, 120],
    backdrops_compatible: [2, 4, 5]
  },
  "stringofpearls.csv": {
    base_price: 60,
    subscription_price: 50,
    label: "String of Pearls Arch (Helium)",
    accent_coords: [180, 120],
    backdrops_compatible: [2, 4, 5]
  },
  "classicspiralarch.csv": {
    base_price: 175,
    subscription_price: 150,
    label: "Full Spiral Arch (Air Filled)",
    accent_coords: [180, 120],
    backdrops_compatible: [2, 4, 5]
  },
  "rotatetest.csv": {
    base_price: 80,
    subscription_price: 60,
    label: "Rotation Test Design",
    accent_coords: [400, 300],
    backdrops_compatible: [1, 3]
  },
};

    function renderDesignFromCSV(url) {
      Papa.parse(url, {
        download: true,
        header: true,
        complete: function (results) {
          const groups = {
            1: document.getElementById('balloonGroup1'),
            2: document.getElementById('balloonGroup2'),
            3: document.getElementById('balloonGroup3'),
          };
          Object.values(groups).forEach(g => g.innerHTML = '');
          const sorted = results.data.sort((a, b) => Number(a.z_index) - Number(b.z_index));
          sorted.forEach(row => {
            const group = groups[row.group_id];
            if (!group) return;
            const groupIndex = row.group_id - 1;
            const colorName = selectors[groupIndex]?.select.value;
            const colorCode = getColorCodeByName(colorName);
        
            //console.log('Adding row:', row);
            //console.log('Adding balloon of shape:', row.shape, 'with z-index:', row.z_index);
            if (row.shape === 'circleShape' || !(row.shape)) {
              const theBalloon = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
              theBalloon.setAttribute('cx', row.cx);
              theBalloon.setAttribute('cy', row.cy);
              theBalloon.setAttribute('r', row.radius);
              theBalloon.setAttribute('fill', colorCode);
              theBalloon.setAttribute('opacity', colorName.startsWith('Crystal') ? '0.8' : '1.0'); 
              theBalloon.setAttribute('filter', 'url(#balloonShadow)');
              theBalloon.setAttribute('z-index', row.z_index);
              group.appendChild(theBalloon);
              //console.log('Adding circle with z-index:', row.z_index); 

              const theOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'image');
              theOverlay.setAttribute('href', colorName.includes('Chrome') ? 'assets/sheenChr.png' : 'assets/sheenStd.png');
              theOverlay.setAttribute('x', row.cx - row.radius);
              theOverlay.setAttribute('y', row.cy - row.radius);
              theOverlay.setAttribute('width', row.radius * 2);
              theOverlay.setAttribute('height', row.radius * 2);
              theOverlay.setAttribute('opacity', '0.5');
              theOverlay.setAttribute('z-index', 1+parseInt(row.z_index));
              theOverlay.setAttribute('crossOrigin', 'Anonymous'); // Export fix
              group.appendChild(theOverlay);
              //console.log('Adding overlay with z-index:', 1+parseInt(row.z_index));
            }else if (row.shape === 'heliumShape' ){
            const theBalloon = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            theBalloon.setAttribute('href', '#heliumShape');
            theBalloon.setAttribute('class', 'balloon');
            theBalloon.setAttribute('transform', `rotate(${row.rotation} ${row.cx} ${row.cy}) translate(${row.cx - row.radius} ${row.cy - row.radius}) scale(${row.radius / 17.75})`);
            theBalloon.setAttribute('z-index', row.z_index);
            theBalloon.setAttribute('fill', colorCode);
            //theBalloon.setAttribute('opacity', '0.8');
            group.appendChild(theBalloon);

            const theOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'image');
              theOverlay.setAttribute('href', colorName.includes('Chrome') ? 'assets/heliumSheenChr.png' : 'assets/heliumSheenStd.png');
              theOverlay.setAttribute('x', row.cx - row.radius);
              theOverlay.setAttribute('y', row.cy - row.radius);
              theOverlay.setAttribute('width', row.radius * 2);
              theOverlay.setAttribute('opacity', '0.5');
              theOverlay.setAttribute('transform', `rotate(${row.rotation} ${row.cx} ${row.cy})`);
              theOverlay.setAttribute('z-index', 1 + parseInt(row.z_index));
              theOverlay.setAttribute('crossOrigin', 'Anonymous'); // Export fix

              group.appendChild(theOverlay);
            }else if (row.shape.startsWith("image(")) {
              // Render image balloon shape
              const imageUrl = row.shape.slice(6, -1);
              let image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
              image.setAttribute('x', row.cx - row.radius);
              image.setAttribute('y', row.cy - row.radius);
              image.setAttribute('width', row.radius * 2);
              image.setAttribute('height', row.radius * 2);
              image.setAttribute('href', imageUrl);
              //image.setAttribute('class', 'balloon');
              group.appendChild(image);
            }
          });
        }
      });
    }

    function setPaletteByNames(colorNamesArray) {
      colorNamesArray.forEach((colorName, index) => {
        const colorCode = getColorCodeByName(colorName);
        selectors[index].select.value = colorName;
        const group = document.getElementById(`balloonGroup${index + 1}`);
        if (group) {
          const elements = group.querySelectorAll('circle, use, image');
          elements.forEach(el => {
            if (el.tagName === 'circle') {
              el.setAttribute('fill', colorCode);
              el.setAttribute('opacity', colorName.startsWith('Crystal') ? '0.8' : '1.0');

            } 
            else if (el.tagName === 'use') {
              el.setAttribute('fill', colorCode);
              el.setAttribute('opacity', colorName.startsWith('Crystal') ? '0.8' : '1.0');
            }else if (el.tagName === 'image') {
                let newHref = el.href.baseVal;
                //console.log('newHref:', newHref);
                //console.log('colorName:', colorName);
            if(colorName.includes('Chrome')){
                newHref = newHref.replace(/heenStd/, 'heenChr');
            }else{
                newHref = newHref.replace(/heenChr/, 'heenStd');
              }
                //console.log('Changed newHref to:', newHref);
              el.setAttribute('href', newHref);
            } 
          });
        }
      });
    }



    let swapClickCount = 0;

    const swapButton = document.getElementById('swapButton');
    //swapButton.textContent = 'Swap Colors';
    //swapButton.style.marginTop = '1em';
    swapButton.className = 'swap-button';
    // document.querySelector('form-group').appendChild(swapButton);

    swapButton.addEventListener('click', () => {
      const currentVals = selectors.map(({ select }) => select.value);
      const newVals = [currentVals[2], currentVals[0], currentVals[1]];
      swapClickCount++;
      if (swapClickCount % 3 === 0) {
        [newVals[0], newVals[1]] = [newVals[1], newVals[0]];
      }
      setPaletteByNames(newVals);
    });

// Create B2B Pricing checkbox
const pricingToggle = document.getElementById('b2bToggle');
//pricingToggle.innerHTML = '<input type="checkbox" id="b2bPricing"> B2B Pricing';
//pricingToggle.style.display = 'block';
//document.querySelector('#studioControls').appendChild(pricingToggle);



// Attach listener (if not already defined elsewhere)
document.getElementById('b2bToggle').addEventListener('change', updatePriceDisplay);
document.getElementById('delivery').addEventListener('change', updatePriceDisplay);

    const silhouette = document.createElement('img');
    silhouette.src = 'assets/silhouette.png';
    silhouette.alt = 'Scale Silhouette';
    silhouette.style.position = 'absolute';
    silhouette.style.bottom = '20px';
    silhouette.style.left = '20px';
    silhouette.style.height = '50%';
    silhouette.style.zIndex = '0';
    document.querySelector('#visualizerContainer').appendChild(silhouette);

    const branding = document.createElement('img');
    branding.src = 'assets/KeyWe-Icon-PNG.png';
    branding.alt = 'KeyWe Branding';
    branding.style.position = 'absolute';
    branding.style.bottom = '20px';
    branding.style.right = '20px';
    branding.style.height = '15%';
    branding.style.zIndex = '0';
    document.querySelector('#visualizerContainer').appendChild(branding);

    const palettes = [
{ name: 'Custom Colors...', custom: true },
{ name: '-- Holidays --', separator: true },
{ name: 'Valentine\'s Classic', colors: ['Standard Red', 'Baby Pink', 'Standard White'] },
{ name: 'Valentine\'s Metallic', colors: ['Chrome Rose Gold', 'Cameo Pink', 'Chrome Red'] },
{ name: 'St. Patrick\'s Day', colors: ['Forest Green', 'Lime Green', 'Chrome Gold'] },
{ name: 'Easter', colors: ['Lavender / Lilac', 'Sage / Tea Green', 'Pastel Yellow'] },
{ name: 'Patriotic', colors: ['Standard Red', 'Standard White', 'Standard Blue'] },
{ name: 'Halloween', colors: ['Standard Orange', 'Standard Black', 'Lime Green'] },
{ name: 'Thanksgiving', colors: ['Latte Brown', 'Goldenrod', 'Standard Orange'] },
{ name: 'Hanukkah', colors: ['Navy Blue', 'Chrome Silver', 'Standard White'] },
{ name: 'Christmas Classic', colors: ['Standard Red', 'Forest Green', 'Chrome Gold'] },
{ name: 'Christmas Elegant', colors: ['Chrome Gold', 'Chrome Silver', 'Standard White'] },
{ name: '-- Events --', separator: true },
{ name: 'Blue Baby Shower', colors: ['Baby Blue', 'Standard White', 'Fog Gray'] },
{ name: 'Pink Baby Shower', colors: ['Baby Pink', 'Standard White', 'Cameo Pink'] },
{ name: 'Yellow Baby Shower', colors: ['Pastel Yellow', 'Standard White', 'Goldenrod'] },
{ name: 'Bridal Classic', colors: ['Standard White', 'Chrome Silver', 'Chrome White Gold'] },
{ name: 'Bridal Modern', colors: ['Standard White', 'Cameo Pink', 'White Sand'] },
{ name: '50th Birthday', colors: ['Standard Black', 'Chrome Gold', 'Chrome White Gold'] },
{ name: 'Retirement', colors: ['Navy Blue', 'Chrome Gold', 'Fog Gray'] },
{ name: '-- Schools --', separator: true },
{ name: 'Graduation Default', colors: ['Chrome Gold', 'Standard Black', 'Standard White'] },
{ name: 'Plymouth South', colors: ['Standard Black', 'Turquoise', 'Standard Black'] },
{ name: 'Plymouth North', colors: ['Navy Blue', 'Fog Gray', 'Goldenrod'] },
{ name: 'Bourne High', colors: ['Plum Purple', 'Standard Black', 'Standard White'] },
{ name: 'Sandwich High', colors: ['Baby Blue', 'Navy Blue', 'Standard White'] },
{ name: 'Wareham High', colors: ['Plum Purple', 'Goldenrod', 'Standard White'] },
{ name: 'Silver Lake RHS', colors: ['Standard Red', 'Fog Gray', 'Standard White'] },
{ name: '-- Colleges --', separator: true },
{ name: 'Bridgewater State', colors: ['Standard Red', 'Standard White', 'Standard Black'] },
{ name: 'UMass-Dartmouth', colors: ['Navy Blue', 'Goldenrod', 'Standard White'] },
{ name: 'Mass Maritime', colors: ['Navy Blue', 'Latte Brown', 'Standard White'] },
{ name: 'Stonehill', colors: ['Plum Purple', 'Standard Black', 'Standard White'] },
{ name: 'Wheaton', colors: ['Navy Blue', 'Fog Gray', 'Standard White'] },
{ name: '-- Other --', separator: true },
{ name: 'Keylium Music & Events', colors: ['Plum Purple', 'Fog Gray', 'Standard White'] }
    ];

// Create design selector dropdown
const designSelect = document.getElementById('designSelect');
// designSelect.id = 'designSelect';
Object.entries(allDesignMetadata).forEach(([filename, data]) => {
  const option = document.createElement('option');
  option.value = filename;
  option.textContent = data.label || filename;
  designSelect.appendChild(option);
});

designSelect.addEventListener('change', () => {
  const selectedFile = designSelect.value;
  loadDesignMetadata(selectedFile, allDesignMetadata);
    // Load the corresponding CSV and update the preview map
  fetch(`assets/designs/${selectedFile}`)
    .then(response => response.text())
    .then(csvText => {
      const rows = csvText.trim().split('\n').slice(1); // skip header
      const svg = document.getElementById('previewMap');
      const groups = [
        document.getElementById('balloonGroup1'),
        document.getElementById('balloonGroup2'),
        document.getElementById('balloonGroup3')
      ];
      
      groups.forEach(group => group.innerHTML = '');
      let counter = 0;
      rows.forEach(row => {
        let [group_id, cx, cy, radius, z_index, shapeType, rotation] = row.split(',');
        if (!(shapeType)){ shapeType = 'circleShape';}
        if (!(rotation)){ rotation = 0;}
        const colorName = document.querySelectorAll('.colorSelect')[group_id - 1].value;
        const colorCode = getColorCodeByName(colorName);
        let group = groups[group_id - 1];
        counter += 1;
        //console.log('Adding row: ', counter, ' in group ', group, ' of shape ', shapeType);
        if (shapeType.indexOf('circle') >=0 || !(shapeType)) {
                  // Render circular balloon shape
        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', colorCode);
        circle.setAttribute('opacity', colorName.startsWith('Crystal') ? '0.8' : '1.0');
        circle.setAttribute('filter', 'url(#balloonShadow)');

        circle.setAttribute('class', 'balloon');
        //console.log('Adding ', circle);
        group.appendChild(circle);
        //console.log('Adding balloon of shape:', shapeType, 'with z-index:', z_index);


        let overlay = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        overlay.setAttribute('x', cx - radius);
        overlay.setAttribute('y', cy - radius);
        overlay.setAttribute('width', radius * 2);
        overlay.setAttribute('height', radius * 2);
        overlay.setAttribute('href', colorName.includes('Chrome') ? 'assets/sheenChr.png' : 'assets/sheenStd.png');
        overlay.setAttribute('class', 'balloon');
        overlay.setAttribute('opacity', '0.5');
        group.appendChild(overlay);
      
    } else if (shapeType === 'heliumShape') {
      // Render helium balloon shape
          let heliumShape = document.createElementNS('http://www.w3.org/2000/svg', 'use');
          heliumShape.setAttribute('href', '#heliumShape');
          heliumShape.setAttribute('class', 'balloon');
          heliumShape.setAttribute('transform', `rotate(${rotation} ${cx} ${cy}) translate(${cx - radius} ${cy - radius}) scale(${radius / 17.75})`);
          heliumShape.setAttribute('z-index', z_index);
          heliumShape.setAttribute('fill', colorCode);
          

          group.appendChild(heliumShape);
        //console.log('Adding balloon of shape:', shapeType, 'with z-index:', z_index);


        let overlay = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        overlay.setAttribute('x', cx - radius);
        overlay.setAttribute('y', cy - radius);
        overlay.setAttribute('width', radius * 2);
        overlay.setAttribute('transform', `rotate(${rotation} ${cx} ${cy})`);
        overlay.setAttribute('href', colorName.includes('Chrome') ? 'assets/heliumSheenChr.png' : 'assets/heliumSheenStd.png');
        overlay.setAttribute('class', 'balloon');
        overlay.setAttribute('opacity', '0.5');
        group.appendChild(overlay);
        } else if (shapeType.startsWith("image(")) {
          // Render image balloon shape
                    console.log('Adding image balloon of shape:', shapeType, 'with z-index:', z_index);
          const imageUrl = shapeType.slice(6, -1);
          let image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
          image.setAttribute('x', cx - radius);
          image.setAttribute('y', cy - radius);
          image.setAttribute('width', radius * 2);
          image.setAttribute('height', radius * 2);
          image.setAttribute('href', imageUrl);
          //image.setAttribute('class', 'balloon');
          group.appendChild(image);
        }
      });
    
    });
    // Rebind backdrop color update listeners on color dropdowns
    document.querySelectorAll('.colorSelect').forEach(select => {
  select.removeEventListener('change', updateBackdropColor); // prevent duplicates
  select.addEventListener('change', updateBackdropColor);
});
    // Rebind backdrop color update listeners on palette dropdown
     document.querySelectorAll('.paletteSelect').forEach(select => {
  select.removeEventListener('change', updateBackdropColor); // prevent duplicates
  select.addEventListener('change', updateBackdropColor);
});
});

// document.querySelector('#studioControls').appendChild(designSelect);


    const paletteSelect = document.getElementById('paletteSelect');

    // Clear existing options and repopulate from the full list
    paletteSelect.innerHTML = '';

    palettes.forEach(palette => {
      const option = document.createElement('option');
      option.textContent = palette.name;
      if (palette.separator) {
        option.disabled = true;
      } else {
        option.value = palette.name;
      }
      paletteSelect.appendChild(option);
    });

    const selectors = [
      { select: document.getElementById('colorSelect1'), balloon: document.getElementById('balloon1'), overlay: document.querySelector('#balloonGroup1 image') },
      { select: document.getElementById('colorSelect2'), balloon: document.getElementById('balloon2'), overlay: document.querySelector('#balloonGroup2 image') },
      { select: document.getElementById('colorSelect3'), balloon: document.getElementById('balloon3'), overlay: document.querySelector('#balloonGroup3 image') }
    ]; console.log("DEBUG: selectors =", selectors);

    selectors.forEach(({ select }) => {
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = ' Choose...';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);

      colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color.name;
        option.textContent = color.name;
        option.style.backgroundColor = color.code;
        option.style.color = (color.code === '#000000' ? '#FFFFFF' : '#000000'); // Adjust text color for contrast
        select.appendChild(option);
      });

      select.disabled = false;
    });

    // Create Shuffle Groups button
const shuffleBtn = document.getElementById('shuffleButton');
//shuffleBtn.textContent = 'Shuffle Colors';
shuffleBtn.addEventListener('click', () => {
  const selectedFile = designSelect.value;
  fetch(`assets/designs/${selectedFile}`)
    .then(response => response.text())
    .then(csvText => {
      const lines = csvText.trim().split('\n');
      const header = lines[0];
      const data = lines.slice(1).map(row => row.split(','));
      data.forEach(row => {
        row[0] = Math.floor(Math.random() * 3) + 1; // random group_id 1–3
      });
      const newCsv = [header, ...data.map(row => row.join(','))].join('\n');

      const blob = new Blob([newCsv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      fetch(url)
        .then(r => r.text())
        .then(tempCsv => {
          const rows = tempCsv.trim().split('\n').slice(1);
          const svg = document.getElementById('balloonSVG');
          const groups = [
            document.getElementById('balloonGroup1'),
            document.getElementById('balloonGroup2'),
            document.getElementById('balloonGroup3')
          ];
          groups.forEach(group => group.innerHTML = '');
          rows.forEach(row => {
            let [group_id, cx, cy, radius, z_index, shapeType, rotation] = row.split(',');
            if(!(shapeType)){ shapeType = 'circleShape';}
            if(!(rotation)){ rotation = 0;}
            const colorName = document.querySelectorAll('.colorSelect')[group_id - 1].value;
            const colorCode = getColorCodeByName(colorName);
            const group = groups[group_id - 1];

            if (shapeType.indexOf('circleShape') >= 0){
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', colorCode);
        circle.setAttribute('opacity', colorName.startsWith('Crystal') ? '0.8' : '1.0');
        circle.setAttribute('filter', 'url(#balloonShadow)');

        circle.setAttribute('class', 'balloon');
        group.appendChild(circle);

        const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        overlay.setAttribute('x', cx - radius);
        overlay.setAttribute('y', cy - radius);
        overlay.setAttribute('width', radius * 2);
        overlay.setAttribute('height', radius * 2);
        overlay.setAttribute('href', colorName.includes('Chrome') ? 'assets/sheenChr.png' : 'assets/sheenStd.png');
        overlay.setAttribute('class', 'balloon');
        overlay.setAttribute('opacity', '0.5'); 
        group.appendChild(overlay);
      
    } else if (shapeType.indexOf('heliumShape')>=0) {
          const heliumShape = document.createElementNS('http://www.w3.org/2000/svg', 'use');
          heliumShape.setAttribute('href', '#heliumShape');
          heliumShape.setAttribute('class', 'balloon');
          heliumShape.setAttribute('transform', `rotate(${rotation} ${cx} ${cy}) translate(${cx - radius} ${cy - radius}) scale(${radius / 17.75})`);
          heliumShape.setAttribute('opacity', colorName.startsWith('Crystal') ? '0.8' : '1.0');
          heliumShape.setAttribute('z-index', z_index);
          heliumShape.setAttribute('fill', colorCode);
          // heliumShape.setAttribute('opacity', '0.8');
          group.appendChild(heliumShape);

        const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        overlay.setAttribute('x', cx - radius);
        overlay.setAttribute('y', cy - radius);
        overlay.setAttribute('width', radius * 2);

        overlay.setAttribute('transform', `rotate(${rotation} ${cx} ${cy})`);
        overlay.setAttribute('href', colorName.includes('Chrome') ? 'assets/heliumSheenChr.png' : 'assets/heliumSheenStd.png');
        overlay.setAttribute('class', 'balloon');
        overlay.setAttribute('opacity', '0.5'); 

        group.appendChild(overlay);
        }else if (shapeType.startsWith("image(")) {
          // Render image balloon shape
          console.log('Adding image balloon of shape:', shapeType, 'with z-index:', z_index);
          const imageUrl = shapeType.slice(6, -1);
          let image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
          image.setAttribute('x', cx - radius);
          image.setAttribute('y', cy - radius);
          image.setAttribute('width', radius * 2);
          image.setAttribute('height', radius * 2);
          image.setAttribute('href', imageUrl);
          //image.setAttribute('class', 'balloon');
          group.appendChild(image);
        }
          });
        });
    });
});
//document.querySelector('#studioControls').appendChild(shuffleBtn);

// Create Undo Shuffle button
const undoBtn = document.getElementById('undoShuffle');
//undoBtn.textContent = 'Undo Shuffle';
undoBtn.addEventListener('click', () => {
  const event = new Event('change');
  designSelect.dispatchEvent(event);
});
//document.querySelector('#studioControls').appendChild(undoBtn);

     /*selectors.forEach(({ select, balloon, overlay }) => {
      select.addEventListener('change', () => {
        const selectedName = select.value;
        const colorObj = colors.find(c => c.name === selectedName);
        if (colorObj) {
          balloon.setAttribute('fill', colorObj.code);
          overlay.setAttribute('href', selectedName.includes('Chrome') ? 'assets/sheenChr.png' : 'assets/sheenStd.png');
        }
      });
    });  */

document.querySelectorAll('.colorSelect').forEach((select, index) => {
  // console.log(`Binding select ${index} to balloonGroup${index + 1}`);
  select.addEventListener('change', () => {
    const colorName = select.value;
    const colorCode = getColorCodeByName(colorName);
    const group = document.getElementById(`balloonGroup${index + 1}`);
    if (!group) {
      console.warn(`Missing group balloonGroup${index + 1}`);
      return;
    }

    group.querySelectorAll('circle').forEach(circle => {
      circle.setAttribute('fill', colorCode);
      circle.setAttribute('opacity', colorName.startsWith('Crystal') ? '0.8' : '1.0');
     circle.setAttribute('filter', 'url(#balloonShadow)');
    });

    group.querySelectorAll('use').forEach(s => {
      s.setAttribute('fill', colorCode);
      s.setAttribute('opacity', colorName.startsWith('Crystal') ? '0.8' : '1.0');
     s.setAttribute('filter', 'url(#balloonShadow)');
    });

    group.querySelectorAll('image').forEach(el => {

    let newHref = el.href.baseVal;
                //console.log('newHref:', newHref);
                //console.log('colorName:', colorName);
            if(colorName.includes('Chrome')){
                newHref = newHref.replace(/heenStd/, 'heenChr');
            }else{
                newHref = newHref.replace(/heenChr/, 'heenStd');
              }
                //console.log('Changed newHref to:', newHref);
              el.setAttribute('href', newHref);

    });
  });
});



    paletteSelect.addEventListener('change', () => {
      const selectedPalette = palettes.find(p => p.name === paletteSelect.value);
      if (selectedPalette && selectedPalette.colors) {
        setPaletteByNames(selectedPalette.colors);
        selectors.forEach(({ select }) => (select.disabled = true));
      } else if (selectedPalette && selectedPalette.custom) {
        selectors.forEach(({ select }) => (select.disabled = false));
      }
    });

// Update backdrop fill color when palette or colors change
function updateBackdropColor() {
  const backdrop = document.getElementById('backdropShape');
  if (!backdrop) return;
 // console.log('Updating backdrop color to '+document.getElementById('color1').value);
  const primaryColorName = document.getElementById('color1').value || '';
  const primaryColor = getColorCodeByName(primaryColorName);
 // console.log('Updating backdrop color code to '+primaryColor);
  backdrop.setAttribute('fill', primaryColor);
}

// Hook into color dropdowns
setTimeout(() => {
  document.querySelectorAll('.color-select').forEach(select => {
    select.addEventListener('change', updateBackdropColor);
  });
}, 100);

// Hook into palette dropdown if applicable
setTimeout(() => {
  document.querySelectorAll('.palette-select').forEach(select => {
    select.addEventListener('change', updateBackdropColor);
  });
}, 100);

// Hook into swap button
setTimeout(() => {
  document.querySelectorAll('.swap-button').forEach(select => {
    select.addEventListener('click', updateBackdropColor);
  });
}, 100);
setTimeout(() => {
  document.querySelectorAll('.palette-select').forEach(select => {
    select.addEventListener('change', updateBackdropColor);
  });
}, 100);



const backdropSelect = document.createElement('select');
backdropSelect.id = 'backdropSelect';
[
  { value: 0, label: 'None' },
  { value: 1, label: 'Half Round (1)' },
  { value: 2, label: 'Half Round (2)' },
  { value: 3, label: 'Angled (1)' },
  { value: 4, label: 'Angled (2)' },
  { value: 5, label: 'Shimmer Wall' }
].forEach(opt => {
  const o = document.createElement('option');
  o.value = opt.value;
  o.textContent = opt.label;
  backdropSelect.appendChild(o);
});

var deliveryAmount = 0; // Default delivery amount
var deliveryDict = {};

backdropSelect.addEventListener('change', () => {
  const svg = document.getElementById('balloonSVG');
  const existing = document.getElementById('backdropShape');
  if (existing) svg.removeChild(existing);
  const selected = parseInt(backdropSelect.value);
  if (selected !== 0) {
    let shape;
    switch (selected) {
      case 1: // Half Round (1)
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        shape.setAttribute('d', 'M50,350 A250,250 0 0,1 550,350');
        break;
      case 2: // Half Round (2)
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        shape.setAttribute('d', 'M50,350 A200,200 0 0,1 550,350');
        break;
      case 3: // Angled (1)
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        shape.setAttribute('points', '50,350 300,50 550,350');
        break;
      case 4: // Angled (2)
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        shape.setAttribute('points', '100,350 300,100 500,350');
        break;
      case 5: // Shimmer Wall
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        shape.setAttribute('x', 120);
        shape.setAttribute('y', 80);
        shape.setAttribute('width', 360);
        shape.setAttribute('height', 240);
        shape.setAttribute('rx', 0);
        break;
    }
    if (shape) {
      shape.setAttribute('id', 'backdropShape');
      shape.setAttribute('fill', getColorCodeByName(document.getElementById('color1').value));
      //shape.setAttribute('stroke', '#bbb');
      //shape.setAttribute('stroke-width', 2);
      svg.insertBefore(shape, svg.firstChild);
    }
    /* const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('id', 'backdropShape');
    rect.setAttribute('x', 120);
    rect.setAttribute('y', 80);
    rect.setAttribute('width', 360);
    rect.setAttribute('height', 240);
    rect.setAttribute('rx', 0);
    rect.setAttribute('fill', getColorCodeByName(document.getElementById('color1').value));
    
    svg.insertBefore(rect, svg.firstChild); */
  }
});
//document.querySelector('#studioControls').appendChild(backdropSelect);



// Create persistent price display
const priceDisplay = document.createElement('div');
priceDisplay.id = 'priceDisplay';
priceDisplay.style.marginTop = '1em';
priceDisplay.style.fontWeight = 'bold';
priceDisplay.textContent = 'Price: $0';
//document.querySelector('#studioControls').appendChild(priceDisplay);



let currentDesignMeta = {};

function loadDesignMetadata(filename, metadata) {
  currentDesignMeta = metadata[filename] || {};
   loadDeliveryChargesFromCSV('assets/deliverycharges2025.csv')
          .then(dict => {
            populateDeliveryDropdown(dict);
            deliveryDict = dict;
            console.log("DEBUG: Delivery charges loaded:", deliveryDict);
          });

  updatePriceDisplay();
  console.log("DEBUG: currentDesignMeta =", currentDesignMeta);

}

function updatePriceDisplay() {

  const deliverySelect = document.getElementById('delivery');
  //console.log("DEBUG: deliverySelect =", deliverySelect);
  //console.log("DEBUG: deliveryDict =", deliveryDict);
  var delivCharge = 0;
  loadDeliveryChargesFromCSV('assets/deliverycharges2025.csv')
    .then(dict => {
      //console.log("DeliverySelectValue:", deliverySelect.value);
      if (deliverySelect.value == "Local Pickup") {
        delivCharge = 0;
        const isB2B = document.getElementById('b2bToggle').checked;

        var price = (isB2B ? currentDesignMeta.subscription_price : currentDesignMeta.base_price);
        //console.log("DEBUG: price =", price, " and delivery charge is ", delivCharge);

       //if (typeof price !== 'number'){ console.log("Price was "+price); price = 0;}
       //console.log("DEBUG: price =", price);
        var priceDisplay = document.getElementById('priceOutput');
        priceDisplay.innerHTML = `<strong>Your Price:</strong> $${price+delivCharge}${isB2B ? ' per month' : ''}`;
      } else {
        //console.log("DEBUG: Delivery charge is "+ dict[deliverySelect.value].delivery);
        delivCharge = dict[deliverySelect.value].delivery;
        const isB2B = document.getElementById('b2bToggle').checked;
       //console.log("DEBUG: isB2B =", isB2B);
       var price = (isB2B ? currentDesignMeta.subscription_price : currentDesignMeta.base_price);
       //console.log("DEBUG: price =", price, " and delivery charge is ", delivCharge);

       //if (typeof price !== 'number'){ console.log("Price was "+price); price = 0;}
       //console.log("DEBUG: price =", price);
        var priceDisplay = document.getElementById('priceOutput');
        priceDisplay.innerHTML = `<strong>Your Price:</strong> $${price+delivCharge}${isB2B ? ' per month' : ''}`;
      }
  });
  //console.log("DEBUG: deliveryAmount =", delivCharge);

  
}

document.getElementById('b2bToggle').addEventListener('change', updatePriceDisplay);

// loadDesignMetadata('classicspiralarch.csv', allDesignMetadata)

/* 
// 1. Export SVG snapshot as PNG
function svgToPng(svgEl) {
  return new Promise((resolve) => {
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svgEl.viewBox.baseVal.width || svgEl.clientWidth;
      canvas.height = svgEl.viewBox.baseVal.height || svgEl.clientHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(resolve);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

// 2. Upload image to your server securely
function uploadImage(blob, filename) {
  const formData = new FormData();
  formData.append('file', blob, filename);
  return fetch('/upload.php', {
    method: 'POST',
    headers: {
      'X-Upload-Token': 'MySecretKey123'
    },
    body: formData
  }).then(res => res.json()).then(res => res.success ? res.url : null);
}

// 3. Button to export and checkout
const checkoutBtn = document.getElementById('checkoutButton');
 */

/* checkoutBtn.addEventListener('click', async () => {
  const svgEl = document.querySelector('#balloonSVG');
  if (!svgEl) return alert('Preview not found');

  const blob = await svgToPng(svgEl);
  const orderId = `design_${Date.now()}`;
  const imageUrl = await uploadImage(blob, `${orderId}.png`);

  const isB2B = document.getElementById('b2bPricing').checked;
  const price = isB2B ? currentDesignMeta.subscription_price : currentDesignMeta.base_price;

  if (!imageUrl) return alert('Image upload failed');

  const squareLink = 'https://square.link/u/YOUR_CHECKOUT_ID'; // replace this!
  const note = `Design Preview: ${imageUrl} Price: $${price}`;
  const checkoutUrl = `${squareLink}?note=${encodeURIComponent(note)}`;
  window.open(checkoutUrl, '_blank');
}); */

// This code assumes you're using a canvas with id="design-canvas"
// and that you want to display a modal form to collect order info,
// upload the preview image to Cloudinary, and then submit everything
// via POST to a Google Form.

// Cloudinary setup: Replace with your own credentials
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dx6ul77rd/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "keywe-customer-image";

// Google Form POST URL and entry field IDs (replace with your actual values)
const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSejTR_mdoHkDczE_k8sGwtg0_7lXK3Adiw5SWJCnHtorNqTCg/formResponse";
const FORM_FIELDS = {
  name: "entry.484152820",
  email: "entry.1530728364",
  phone: "entry.124219980",
  delivery: "entry.578500014",
  address1: "entry.1349205336",
  address2: "entry.1636910658",
  town: "entry.1665833370",
  order_details: "entry.1164158434",
  delivery_date: "entry.811788899",
  image_url: "entry.1233842721",
  price_quote: "entry.1458457949",
  submitted: "submissionTimestamp"
};

function createSplashForm() {
  const isB2B = document.getElementById('b2bToggle').checked;
  var price = 69;
  const priceOutput = document.getElementById('priceOutput');
  if (priceOutput) {
    price = parseFloat(priceOutput.textContent.replace(/[^0-9.-]+/g, ""));
  }
  const deliverySelect = document.getElementById('delivery');
  const method = deliverySelect.value === "Local Pickup" ? "Pickup" : "Delivery to " + deliverySelect.value;

  const modalHtml = `
    <div id="order-modal" style="
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    ">
      <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 500px; width: 100%;">
        <h2>Submit Your Order</h2>
        <form id="order-form">
          <label class="compact">Name:<br><input type="text" id="name-input" required></label><br>
          <label class="compact">Email:<br><input type="email" id="email-input" required></label><br>
          <label class="compact">Phone:<br><input type="tel" id="phone-input"></label><br>
          <label class="compact" id="address1-label">Delivery Address Line 1:<br><input type="text" id="address1-input" placeholder="Street Address" required></label><br>
          <label class="compact" id="address2-label">Delivery Address Line 2:<br><input type="text" id="address2-input" placeholder="Apartment, suite, etc."></label><br>
          <label class="compact" id="town-label">Town/City:<br><input type="text" style="disabled: true;" id="town-input" required disabled value="${deliverySelect.value}"></label><br>
          <label class="compact">Date for ${method}:<br><input type="date" id="date-input" required></label><br>
          <label class="compact" id="pickup-location-label" style="display:none;">Pickup at:<br><a href="https://maps.app.goo.gl/jC4GJQyQXntMBhGu6" target-"_new">Keylium HQ</a><br>41 Janebar Circle<br>Plymouth, MA 02360</label><br>
          <div>
            <strong>Design Preview:</strong><br>
            <img id="preview-img" style="width: 100%; max-height: 300px; object-fit: contain; margin-top: 10px;" />
          </div><br>
          <label>Special Requests/Instructions:<br><textarea rows="4" cols="40" id="special-requests" placeholder="Any special requests or instructions for your order? We will try to accommodate them!"></textarea></label><br>
          <label>Your Price: ${price ? `<strong>$${price}</strong>` : '???'}</label><br>
          <label><p>Click <strong>Submit Order</strong> to confirm your order. You will receive a confirmation email with details, and we'll send an invoice with payment information to confirm your design.</p></label><br>
          <div style="display: flex; justify-content: space-between;">
            <button type="submit" style="width:75%;">Submit Order</button>&nbsp;
            <button type="button" id="back-button" style="width:20%;">Cancel</button>
          </div>
          
          <input type="hidden" name="${FORM_FIELDS.image_url}" id="image-url-input">
        </form>
      </div>
    </div>
  `;


  document.body.insertAdjacentHTML("beforeend", modalHtml);

    if (method === "Pickup") {
      document.getElementById('pickup-location-label').setAttribute('style', 'display: block;');
    document.getElementById('address1-label').setAttribute('style', 'display: none;');
    document.getElementById('address2-label').setAttribute('style', 'display: none;');
    document.getElementById('town-label').setAttribute('style', 'display: none;');
    document.getElementById('address1-input').setAttribute('hidden', 'true');
    document.getElementById('address2-input').setAttribute('hidden', 'true');
    document.getElementById('town-input').setAttribute('hidden', 'true');
  }
}

function applyComputedStylesAsInline(element) {
  const computedStyle = window.getComputedStyle(element);

  for (let i = 0; i < computedStyle.length; i++) {
    const propName = computedStyle[i];
    const propValue = computedStyle.getPropertyValue(propName);

    // Convert CSS property names (e.g., 'background-color') to camelCase (e.g., 'backgroundColor')
    const jsPropName = propName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

    element.style[jsPropName] = propValue;
  }
}


function showOrderModal(designBlob) {
  createSplashForm();
  const reader = new FileReader();
  reader.onloadend = () => {
    document.getElementById("preview-img").src = reader.result;
  };
  reader.readAsDataURL(designBlob);

  document.getElementById("back-button").addEventListener("click", () => {
    document.getElementById("order-modal").remove();
  });

 

  document.getElementById("order-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name-input").value;
    const email = document.getElementById("email-input").value;
    const phone = document.getElementById("phone-input").value;
    const deliveryDate = document.getElementById("date-input").value;
    //const designJson = getCurrentDesignData();

    // Upload image to Cloudinary
    const imageFormData = new FormData();
    imageFormData.append("file", designBlob);
    imageFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    console.log("blob:", designBlob);
    console.log("blob.type:", designBlob.type);
    console.log("preset:", CLOUDINARY_UPLOAD_PRESET);

    try {
      const uploadRes = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: imageFormData
      });

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.secure_url;

      const orderdeets = `Design: ${allDesignMetadata[document.getElementById('designSelect').value]['label']}\n` +
        `Colors: ${Array.from(document.querySelectorAll('.colorSelect')).map(select => select.value).join(', ')}\n` +
        `B2B Pricing: ${document.getElementById('b2bToggle').checked ? 'Yes' : 'No'}\n\n` + `Special Requests: ${document.getElementById('special-requests').value}`;

      // Submit to Google Form
      const formData = new FormData();
      formData.append(FORM_FIELDS.name, name);
      formData.append(FORM_FIELDS.email, email);
      formData.append(FORM_FIELDS.phone, phone);
      formData.append(FORM_FIELDS.delivery_date, deliveryDate);
      //formData.append(FORM_FIELDS.design_json, JSON.stringify(designJson, null, 2));
      formData.append(FORM_FIELDS.image_url, imageUrl);
      
       var price = 69;
        const priceOutput = document.getElementById('priceOutput');
        if (priceOutput) {
          price = parseFloat(priceOutput.textContent.replace(/[^0-9.-]+/g, ""));
        }

      formData.append(FORM_FIELDS.price_quote, price || "???");
      formData.append(FORM_FIELDS.order_details, orderdeets);
      formData.append(FORM_FIELDS.delivery, document.getElementById("delivery").value);
      formData.append(FORM_FIELDS.address1, document.getElementById("address1-input").value);
      formData.append(FORM_FIELDS.address2, document.getElementById("address2-input").value);
      formData.append(FORM_FIELDS.town, document.getElementById("town-input").value);
      formData.append(FORM_FIELDS.submitted, new Date().toISOString());

      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });

      alert("Your order was submitted successfully!\n\nWe will review and confirm your design shortly and follow up via the email address provided.\n\nWe look forward to serving you!");
      document.getElementById("order-modal").remove();
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("There was a problem submitting your order.");
    }
    const uploadRes = await fetch(CLOUDINARY_UPLOAD_URL, {
  method: "POST",
  body: imageFormData
});

const result = await uploadRes.json();
console.log("Cloudinary response:", result);
  });
}

function svgElementToBlob(svgElement, callback) {
  // Step 1: Serialize the SVG
  const svgString = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  // Step 2: Create an offscreen canvas and draw SVG onto it
  const image = new Image(600, 400);
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    console.log("DEBUG: canvas size:", canvas.width, "x", canvas.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    // Step 3: Convert to blob
    canvas.toBlob((blob) => {
      callback(blob);
      URL.revokeObjectURL(url);
    }, "image/png");
  };
  image.src = url;
}

function downloadBlobAsFile(blob, filename) {
  // Check for Microsoft Edge's specific download method for better compatibility
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create a temporary anchor element
    const a = document.createElement('a');
    document.body.appendChild(a); // Append to the body (can be hidden)

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Set the anchor's href to the Blob URL and the download attribute for the filename
    a.href = url;
    a.download = filename;

    // Programmatically click the anchor to initiate the download
    a.click();

    // Clean up: revoke the Object URL and remove the temporary anchor
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0); // Use setTimeout to ensure the click event has time to register
  }
}

const orderButton = document.getElementById("orderButton");
orderButton.addEventListener("click", () => {

  const previewDiv = document.getElementById("visualizerContainer");
  if (!previewDiv) {
    console.error("Preview container not found");
    return;
  }
  
var uses = document.querySelectorAll('.balloon');
uses.forEach(function(el) {
  el.setAttribute('color',el.getAttribute('fill'));
  el.setAttribute('flood-color',el.getAttribute('fill'));
  el.setAttribute('stop-color',el.getAttribute('fill'));
  el.setAttribute('background',el.getAttribute('fill'));
  //applyComputedStylesAsInline(el);
  console.log("DEBUG: Applied styles to element:", el);
})

htmlToImage
  .toBlob(previewDiv)
  .then(function (blob) {
    showOrderModal(blob);
    console.log("DEBUG: Blob created:", blob);
    // downloadBlobAsFile(blob, 'balloon_design_preview.png');
  });

  });
  
function populateDeliveryDropdown(deliveryDict) {
  const select = document.getElementById("delivery");

  // Add the default Local Pickup option
  const pickupOption = document.createElement("option");
  pickupOption.value = "Local Pickup";
  pickupOption.textContent = "Local Pickup (Free!)";
  select.appendChild(pickupOption);

  // Sort town names alphabetically
  const towns = Object.keys(deliveryDict).sort();

  // Add each town as an option
  for (const town of towns) {
    const deliveryAmount = deliveryDict[town].delivery > 0 ? deliveryDict[town].delivery : "Free!";
    const option = document.createElement("option");
    option.value = town;
    option.textContent = `${town} (${deliveryAmount > 0 ? "+$" : ""}${deliveryAmount})`;
    select.appendChild(option);
  }
}



    window.addEventListener('DOMContentLoaded', () => {
      paletteSelect.value = 'Custom Colors...';
       const initialDesign = getQueryParam("design") || "stringofpearls";
       renderDesignFromCSV(`assets/designs/${initialDesign}.csv`);
       const designSelect = document.getElementById("designSelect");
       if (designSelect && initialDesign) {
        designSelect.value = initialDesign+".csv";
        }
        loadDesignMetadata(designSelect.value, allDesignMetadata);

       
    });

