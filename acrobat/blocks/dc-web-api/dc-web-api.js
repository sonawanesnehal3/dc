// import {createTag} from "../../scripts/miloUtils.js";
const createTag = function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
      || html instanceof SVGElement
      || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  return el;
}

let loadDC;
if (!window.localStorage.limit) {
  window.localStorage.limit = 0
}

const handleDragOver = (e) => {
  e.preventDefault();
}

const handleDrop = (e) => {
  // let datas;
  e.preventDefault();
  console.log(e.dataTransfer.files);
  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach((item, i) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file.type != 'application/pdf') {
          alert('Please try a PDF');
          return
        } else {
          loadDC = true;
          window.location = '/drafts/gunn/solo-drop-zone'
        }
        console.log(`KIND = file, file[${i}].name = ${file.name}`);
      }
    });
  } else {
    [...e.dataTransfer.files].forEach((file, i) => {
      if (file.type != 'application/pdf') {
        alert('Please try a PDF');
        return
      } else {
        loadDC = true;
        window.location = '/drafts/gunn/solo-drop-zone'
      }
      console.log(`file[${i}].name = ${file.name}`);
    });
  }
}



export default function init(element) {
  console.log(element.querySelectorAll(':scope > div'));
        //Create Fake Widget
        // createTag.then((tag) => {
          const content = element.querySelectorAll(':scope > div');

          Array.from(content).forEach( (con) => {
            con.classList.add('hide')
          })

          element.classList.add('ready');
          // element.setAttribute('ready', '')


          const wrapper = createTag('div', {id: 'CID', class: `fsw widget-wrapper ` });
          const heading = createTag('h1', { class: 'widget-heading' }, `${content[1].textContent}`);
          const dropZone = createTag('div', { id: 'dZone', class: 'widget-center' });
          const copy = createTag('p', { class: 'widget-copy' }, `${content[2].textContent}`);
          // const button = createTag('input', { type: 'file', id: 'file-upload', class: 'hide' }, `${content[3].textContent}`);
          const buttonLabel = createTag('a', { href: '/drafts/gunn/solo-drop-zone', class: 'widget-button' }, `${content[3].textContent}`);
          const legal = createTag('p', { class: 'widget-legal' }, `${content[4].textContent}`);
          const subTitle = createTag('p',{ class: 'widget-sub' } , 'Adobe Acrobat');
          const upsell = createTag('p',{ class: 'demo-text' } , content[5].textContent);

          const iconLogo = createTag('div',{ class:  'widget-icon'} );
          const iconSecurity = createTag('div',{ class:  'security-icon'} );
          const icon = createTag('div',{ class:  'widget-big-icon'} );
          
          const footer = createTag('div',{ class:  'widget-footer'} );


          if (Number(window.localStorage.limit) > 1) {
            upsell.classList.remove('hide')
            wrapper.append(upsell);
            element.append(wrapper);
          } else {
            wrapper.append(subTitle);
            subTitle.prepend(iconLogo);
            wrapper.append(heading);
            wrapper.append(dropZone)
            dropZone.append(copy);
            copy.prepend(icon);
            // dropZone.append(button);
            dropZone.append(buttonLabel);
            wrapper.append(footer)
            // wrapper.append(legal);
            footer.append(iconSecurity);
            footer.append(legal);
            element.append(wrapper);
          }

          if (Number(window.localStorage.limit) === 1 ) {
            const secondConversion = createTag('p',{ class: 'demo-text' } , 'Returning Visitor');
            heading.prepend(secondConversion);
          }



          dropZone.addEventListener('dragover', (file) => {
            handleDragOver(file);
            dropZone.classList.add('dragging');
          });
          dropZone.addEventListener('dragleave', (file) => {
            dropZone.classList.remove('dragging');
          })

          dropZone.addEventListener('drop', (file) => {
            handleDrop(file);
            dropZone.classList.remove('dragging');
            if (loadDC) {window.localStorage.limit = 1 + Number(window.localStorage.limit) }
          })


}
