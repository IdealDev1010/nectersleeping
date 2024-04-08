const selectors = {
  customerAddresses: '[data-customer-addresses]',
  addressCountrySelect: '[data-address-country-select]',
  addressContainer: '[data-address]',
  toggleAddressButton: 'button[aria-expanded]',
  cancelAddressButton: 'button[type="reset"]',
  deleteAddressButton: 'button[data-confirm-message]',
};

const attributes = {
  expanded: 'aria-expanded',
  confirmMessage: 'data-confirm-message',
};

class CustomerAddresses {
  constructor() {
    this.elements = this._getElements();
    if (Object.keys(this.elements).length === 0) return;
    this._setupCountries();
    this._setupEventListeners();
  }

  _getElements() {
    const container = document.querySelector(selectors.customerAddresses);
    return container
      ? {
        container,
        addressContainer: container.querySelector(selectors.addressContainer),
        toggleButtons: document.querySelectorAll(selectors.toggleAddressButton),
        cancelButtons: container.querySelectorAll(selectors.cancelAddressButton),
        deleteButtons: container.querySelectorAll(selectors.deleteAddressButton),
        countrySelects: container.querySelectorAll(selectors.addressCountrySelect),
      }
      : {};
  }

  _setupCountries() {
    if (Shopify && Shopify.CountryProvinceSelector) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
        hideElement: 'AddressProvinceContainerNew',
      });
      this.elements.countrySelects.forEach((select) => {
        const formId = select.dataset.formId;
        // eslint-disable-next-line no-new
        new Shopify.CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
          hideElement: `AddressProvinceContainer_${formId}`,
        });
      });
    }
  }

  _setupEventListeners() {
    this.elements.toggleButtons.forEach((element) => {
      element.addEventListener('click', this._handleAddEditButtonClick);
    });
    this.elements.cancelButtons.forEach((element) => {
      element.addEventListener('click', this._handleCancelButtonClick);
    });
    this.elements.deleteButtons.forEach((element) => {
      element.addEventListener('click', this._handleDeleteButtonClick);
    });
  }

  _toggleExpanded(target) {
    target.setAttribute(attributes.expanded, (target.getAttribute(attributes.expanded) === 'false').toString());
  }

  _handleAddEditButtonClick = ({ currentTarget }) => {
    this._toggleExpanded(currentTarget);
  };

  _handleCancelButtonClick = ({ currentTarget }) => {
    this._toggleExpanded(currentTarget.closest(selectors.addressContainer).querySelector(`[${attributes.expanded}]`));
  };

  _handleDeleteButtonClick = ({ currentTarget }) => {
    // eslint-disable-next-line no-alert
    if (confirm(currentTarget.getAttribute(attributes.confirmMessage))) {
      Shopify.postLink(currentTarget.dataset.target, {
        parameters: { _method: 'delete' },
      });
    }
  };
}


window.addEventListener("load", function () {

  var checkBoxs = document.querySelectorAll('.toggle_switch');
  var newButton = document.getElementById("compare_variant");
  var closeButton = document.getElementsByClassName("modal-close-button")[0];
  var modal = document.getElementById('MyModal');
  var selectElement1 = document.getElementById('compared-variant-1');
  var selectElement2 = document.getElementById('compared-variant-2');
  var selectIndex = 1;

  function updateButtonState() {
    var checkedCount = 0;
    checkBoxs.forEach(function (checkBox) {
      if (checkBox.checked) {
        checkedCount += 1;
      }
    });

    if (checkedCount == 0) {
        checkBoxs.forEach(function (checkBox) {
          checkBox.disabled = false;
        });
    }

    else if (checkedCount == 1) {
        newButton.classList.remove('hidden');
        newButton.classList.add('disabled');
        newButton.textContent = 'Select one more to compare';

        checkBoxs.forEach(function (checkBox) {
        checkBox.disabled = false;
      });
    }

    else if (checkedCount == 2) {

      newButton.classList.remove('disabled');
      newButton.classList.remove('hidden');
      newButton.textContent = 'Compare Selections';
      
      checkBoxs.forEach(function (checkBox) {
        if (!checkBox.checked) {
          checkBox.disabled = true;
        }

        if (checkBox.checked) {
          checkedCount += 1;
          var variantid = checkBox.id;
          var optionToselect = selectIndex == 1 ? selectElement1 : selectElement2;
          for (let i = 0; i < optionToselect.options.length; i++) {
            console.log(optionToselect.value, 'optionToselect');
            if (optionToselect.options[i].value == variantid) {
              optionToselect.options[i].selected = true;
              break;
            }
          }
          selectIndex++;
        }
      });

      const getItems = document.querySelectorAll('.grid__item.container-item');
      function showSelectedVariantInfo() {
        console.log('test function')
        let checkedItems = []
        for (const item of getItems) {
          if (item.querySelector('label.switch input')) {
            if (!item.querySelector('label.switch input').disabled) {
              checkedItems.push(item.querySelector('img').src);
            }
          }
        }
        console.log(checkedItems);
        for (const oneId of checkedItems) {
          console.log(document.querySelector(`[src="${oneId.replace('https:', '')}"]`).parentElement.parentElement);
          document.querySelector(`.grid__item.modal-item [src="${oneId.replace('https:', '')}"]`).parentElement.parentElement.classList.remove('hidden');
        }
      }
    }

  }
  checkBoxs.forEach(element => {
    element.addEventListener('change', updateButtonState);
  });


  updateButtonState();

  newButton.addEventListener('click', function () {
    modal.style.display = "block";
    showSelectedVariantInfo();
  });

  closeButton.addEventListener('click', function () {
    modal.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  const getItems = document.querySelectorAll('.grid__item.container-item');
  function showSelectedVariantInfo() {
    console.log('test function')
    let checkedItems = []
    for (const item of getItems) {
      if (item.querySelector('label.switch input')) {
        if (!item.querySelector('label.switch input').disabled) {
          checkedItems.push(item.getAttribute('data-testid'));
        }
      }
    }
    
    for (let i = 0; i < checkedItems.length; i++) {
      // console.log(document.querySelector(`[src="${oneId.replace('https:', '')}"]`).parentElement.parentElement);
        document.querySelector(`[data-testid${1}="${checkedItems[0]}"]`).classList.remove('hidden');
        document.querySelector(`[data-testid${2}="${checkedItems[1]}"]`).classList.remove('hidden');
    }
  }

  selectElement1.addEventListener('change', function(event) {
    const item1Els = document.querySelectorAll('.grid__item.modal-item1');
    Array.from(item1Els).map((oneItem) => {
      oneItem.classList.remove('hidden');
      oneItem.classList.add('hidden');
    })

    document.querySelector(`[data-testid1="${document.querySelector("select#compared-variant-1").value}"]`).classList.remove('hidden');
  })

  selectElement2.addEventListener('change', function(event) {
    const item1Els = document.querySelectorAll('.grid__item.modal-item2');
    Array.from(item1Els).map((oneItem) => {
      oneItem.classList.remove('hidden');
      oneItem.classList.add('hidden');
    })

    const selectedValue = document.querySelector("select#compared-variant-2").value;
    document.querySelector(`[data-testid2="${selectedValue}"]`).classList.remove('hidden');
  })
});


