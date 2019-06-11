(function () {

  var faveContacts = [];
  var isFiltering = false;

  window.onload = () => {
    fetchData();
  }

  const fetchData = () => {
    fetch('contacts.json')
    .then(res => res.json())
    .catch(error => handleError(error))
    .then(data => {
      renderContacts(data);
      renderFilter(data);
      renderSearch(data);
    });
  }
  
  const renderContacts = (contacts) => {     
    let contactContainer = getDOMElement('contactContainer');
    let contactList = createElement('ul');

    contactContainer.innerHTML = '';

    contactList.id = 'contactList';
    contactContainer.appendChild(contactList);
    
    if (contacts.length == 0) {        
      handleError('No contacts found');
    } else {
      contacts.forEach(contact => { 
        let contactListEntry = createElement('li');
        contactListEntry.innerText = contact.name;
        contactListEntry.id = contact.id;
        contactListEntry.addEventListener('click', handleClickOnContact(contact));
        contactList.appendChild(contactListEntry);
      });
    }
  }

    const renderFilter = (contacts) => {  
    let filterContainer = getDOMElement('filterContainer');
    let filter = createElement('a'); 

    filter.innerText = 'Filter favourites';
    filter.id = "contactFilter";
    filter.href = '#'; 
    filter.addEventListener('click', handleClickOnFilter(contacts));
    filterContainer.appendChild(filter);
  }
  
  const renderSearch = (contacts) => {
    let searchContainer = getDOMElement('searchContainer');
    let searchInput = createElement('input');
    let searchIcon = createSvgIcon('/assets/magnifier.svg', 'image/svg+xml', 'searchIcon')

    searchInput.setAttribute('type', 'text');
    searchInput.id = ('searchInput')
    searchInput.placeholder = 'Search';
    searchInput.addEventListener('input', handleSearchInput(contacts));
    searchContainer.appendChild(searchInput);
  
    searchContainer.appendChild(searchIcon);
  }

  const renderContactDetails = (contact) => {
    let contactDetails = getDOMElement('contactDetails');
    let faveSrc = contact.favourite ? '/assets/star.svg' : '/assets/star_border.svg';
    let faveIcon = createSvgIcon(faveSrc, 'image/svg+xml', 'fave');
    let closeIcon = createSvgIcon('/assets/close.svg', 'image/svg+xml', 'close');
    let contactName = createElement('h2');
    let contactEmail = createElement('p');

    contactDetails.innerHTML = '';
    contactDetails.classList.remove('hidden'); 
  
    closeIcon.addEventListener('click', handleClickOnCloseIcon('contactDetails')); 
    contactDetails.appendChild(closeIcon);
  
    contactName.innerText = contact.name;
    contactName.id = 'contactDetailName';
    contactDetails.appendChild(contactName);
  
    faveIcon.addEventListener('click', handleClickOnFaveIcon(contact));
    contactDetails.appendChild(faveIcon);
  
    contactEmail.innerText = contact.email;
    contactEmail.id = 'contactDetailEmail';
    contactDetails.appendChild(contactEmail);
  }

  const getDOMElement = (id) => {
    return document.getElementById(id);
  }

  const createElement = (element) => {
    return document.createElement(element);
  }
  
  const createSvgIcon = (src, type, id) => {  
    let svg = createElement('img');

    svg.setAttribute('src', src);
    svg.setAttribute('type', type);
    svg.id = id;
    return svg;
  }
  
  const filterFavourites = () => {
    renderContacts(faveContacts);
  }
  
  const handleError = (msg) => {
    let contactContainer = getDOMElement('contactContainer');
    let errorMessage = createElement('p');

    errorMessage.innerText = msg;
    contactContainer.appendChild(errorMessage);
  }
  
  const handleClickOnContact = (contact) => {
    return function() { 
      renderContactDetails(contact);
    }
  }
  
  const handleClickOnCloseIcon = (elementId) => {
    return function() {
      getDOMElement(elementId).classList.toggle('hidden'); 
    } 
  }
  
  const handleClickOnFaveIcon = (contact) => {
    return function () {
      let faveIcon = getDOMElement('fave');
      
      contact.favourite = !contact.favourite;

      if(contact.favourite) {
        faveIcon.setAttribute('src', '/assets/star.svg')
        faveContacts.push(contact);
      } else {
        faveIcon.setAttribute('src', '/assets/star_border.svg');
        faveContacts.splice(faveContacts.indexOf(contact), 1);      
      }
  
      if (isFiltering == true) {
        filterFavourites()
      }
    }
  }

  const handleClickOnFilter = (contacts) => {
    return function () {
      let contactFilter = getDOMElement('contactFilter');
      
      if (contactFilter.innerText == 'Show all') {
        contactFilter.innerText = 'Filter favourites'
        isFiltering = false;
        renderContacts(contacts);
      } else {
        contactFilter.innerText = 'Show all';
        isFiltering = true;
        filterFavourites();
      }
    }
  }
  
  const handleSearchInput = (contacts) => {
    return function() {
      let contactFilter = getDOMElement('contactFilter');
      let input = getDOMElement('searchInput').value.toLowerCase();
      let matchedContacts = contacts.filter(contact => contact.name.toLowerCase().search(input) >= 0);
        
      if (isFiltering == true) {
        contactFilter.innerText = 'Filter favourites';
      }
      renderContacts(matchedContacts);
    }
  }
}());

