document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');
    let allDogs = [];
  
    // Fetch all pups from the server
    fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(data => {
        allDogs = data; // Assign the entire data array to allDogs
        renderDogBar(allDogs);
      });
  
    // Render dog bar
    function renderDogBar(dogs) {
      dogBar.innerHTML = '';
  
      dogs.forEach(dog => {
        const dogSpan = document.createElement('span');
        dogSpan.textContent = dog.name;
  
        // Add event listener for dog span click
        dogSpan.addEventListener('click', () => {
          showDogInfo(dog);
        });
  
        dogBar.appendChild(dogSpan);
      });
    }
  
    // Show dog info
    function showDogInfo(dog) {
      dogInfo.innerHTML = '';
  
      const dogImage = document.createElement('img');
      dogImage.src = dog.image;
  
      const dogName = document.createElement('h2');
      dogName.textContent = dog.name;
  
      const dogStatus = document.createElement('button');
      dogStatus.textContent = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
  
      // Add event listener for dog status button click
      dogStatus.addEventListener('click', () => {
        toggleDogStatus(dog);
      });
  
      dogInfo.appendChild(dogImage);
      dogInfo.appendChild(dogName);
      dogInfo.appendChild(dogStatus);
    }
  
    // Toggle dog status
    function toggleDogStatus(dog) {
      const updatedStatus = !dog.isGoodDog;
      const patchData = { isGoodDog: updatedStatus };
  
      // Update dog status in the server
      fetch(`http://localhost:3000/pups/${dog.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patchData),
      })
        .then(response => response.json())
        .then(updatedDog => {
          // Update dog status in the allDogs array
          const index = allDogs.findIndex(d => d.id === updatedDog.id);
          if (index !== -1) {
            allDogs[index].isGoodDog = updatedDog.isGoodDog;
          }
  
          // Show updated dog info
          showDogInfo(updatedDog);
  
          // Update dog bar if filter is ON
          const isFilterOn = filterButton.textContent === 'Filter good dogs: ON';
          if (isFilterOn) {
            const filteredDogs = allDogs.filter(d => d.isGoodDog);
            renderDogBar(filteredDogs);
          }
        });
    }
  
    // Toggle filter
    filterButton.addEventListener('click', () => {
      const isFilterOn = filterButton.textContent === 'Filter good dogs: ON';
      filterButton.textContent = isFilterOn ? 'Filter good dogs: OFF' : 'Filter good dogs: ON';
  
      if (isFilterOn) {
        renderDogBar(allDogs);
      } else {
        const filteredDogs = allDogs.filter(d => d.isGoodDog);
        renderDogBar(filteredDogs);
      }
    });
  });
  