import React from "react";
import ReactDOM from 'react-dom';
import {act} from "react-dom/test-utils";
import Stats from "./Stats";
import axios from "axios";
import {fireEvent} from "@testing-library/react";


// tworzę zmienna na konterner
// wyrederowana treść komponentów bedzie znajdowana się tutaj
let container;

// ta funkcja bedzie wykonywałą się przed każdym testem
beforeEach(() => {
    // jako konterner ustanawiam element HTML div
    // następnie dodaje go body w dokumencie
    container = document.createElement("div");
    document.body.appendChild(container);
});

// ta funckja będzie wykonywała się po ką=ażdym teście
afterEach(() => {
    // usuewam z dokumnetu kontener
    // a nastepnie zawartyość jego zmiennej
    // zabopeignie to problemów z
    // renderowaniem przy każdym teście
    document.body.removeChild(container);
    container = null;
});

// test sprawdza czy dane które przyszłby z API
// renderują się poprawnie
test('it renders data from API', async () => {
    // definuje że axios bedzie mockowany
    jest.mock("axios");
    // mowie co konkretnie bedzie mockowane
    axios.get = jest.fn();

    // definuje dane które przyszłyby z API
    // gdybyśmy robili realne zapytanie HTTP
    let mock = {
        ID: 1,
        Avatar: 'https://i.pinimg.com/736x/3b/37/cd/3b37cd80d4f092ed392b1453b64cf0d0.jpg',
        Nazwa: "Testowy Kot",
        Ranking: 1,
        Wygrane: 999,
        Remisy: 0,
        Przegrane: 0
    };

    // UWAGA:
    // komponent Stats wykorzystuje komponent Posts do renderowania wyników API
    // z komponentu Posts wiemy w jaki sposób powinny wygladac dane
    // tj. dlaczego obiekt mock ma akurat taką strukture a nie inną

    // mockuje metode get biblioteki axios jako konkretną implementacje
    // "ej stary, jesli ktoś berdzie probował uzyc Twojej funkcji get() to
    // zamiast wykonywac zapytanie zwroc mu te dane"
    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: [mock]
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    // skoro zmockowalismy dane to wiemy w jakej postaci przysły
    // powinnien byc jeden element z danymi ze zmiennej mock
    const listItem = container.querySelector('#stats-table tr:first-child');
    const statistic = listItem.querySelector('td:last-child');

    expect(listItem).not.toBeNull();
    expect(statistic.innerHTML).toBe(`${mock.Wygrane}/${mock.Remisy}/${mock.Przegrane}`);
});


// test sprawdza filtorowanie po top 10 działa
test('can filter by top 10', async () => {
    // definuje że axios bedzie mockowany
    jest.mock("axios");
    // mowie co konkretnie bedzie mockowane
    axios.get = jest.fn();

    // definuje dane które przyszłyby z API
    // gdybyśmy robili realne zapytanie HTTP
    let mock = [
        {
            ID: 1,
            Ranking: 4,
        },
        {
            ID: 2,
            Ranking: 55,
        },
        {
            ID: 3,
            Ranking: 1,
        }
    ];

    // UWAGA:
    // komponent Stats wykorzystaje komponent Posts do renderowania wyników API
    // z komponentu Posts wiemy w jaki sposób powinne wygladac dane

    // UWAGA:
    // Mozna ogarniczac klucze obiektów do tych które są wymagane przez komponent
    // oraz do testowania, np zeby sprawdzic czy filtrowanie dziala
    // potrzebujemy tylko klucze ID oraz Ranking

    // mockuje metode get biblioteki axios jako konkretną implementacje
    // "ej stary, jesli ktoś berdzie probował uzyc Twojej funkcji get() to
    // zamiast wykonywac zapytanie zwroc mu te dane"
    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    // skoro zmockowalismy dane to wiemy w jakej postaci przysły
    // sprawdzamy poczatkowy stan, powinny byc wyrenderowane 3 elementy listy
    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    // klikamy przycisk do filtracji po top 10
    fireEvent.click(container.querySelector('#filter-top-10'));

    list = container.querySelector('#stats-table');
    listItems = list.querySelectorAll('tr');
    // lista statysk powinna zawierac 2 elementy listy
    // poniewaz ranking tylko dwóch gracz jest mniejszy, rowny 10
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(2);
});

// test sprawdza filtorowanie po top 20 działa
test('can filter by top 20', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Ranking: 4,
        },
        {
            ID: 2,
            Ranking: 55,
        },
        {
            ID: 3,
            Ranking: 1,
        },
        {
            ID: 4,
            Ranking: 15,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#filter-top-20'));

    list = container.querySelector('#stats-table');
    listItems = list.querySelectorAll('tr');

    expect(list).not.toBeNull();
    expect(listItems.length).toBe(3);
});

// test sprawdza filtorowanie po top 30 działa
test('can filter by top 30', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Ranking: 4,
        },
        {
            ID: 2,
            Ranking: 55,
        },
        {
            ID: 3,
            Ranking: 1,
        },
        {
            ID: 4,
            Ranking: 15,
        },
        {
            ID: 5,
            Ranking: 40,
        },
        {
            ID: 6,
            Ranking: 60,
        },
        {
            ID: 7,
            Ranking: 27,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#filter-top-30'));

    list = container.querySelector('#stats-table');
    listItems = list.querySelectorAll('tr');

    expect(list).not.toBeNull();
    expect(listItems.length).toBe(4);
});

// test sprawdza filtorowanie po top 50 działa
test('can filter by top 50', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Ranking: 4,
        },
        {
            ID: 2,
            Ranking: 55,
        },
        {
            ID: 3,
            Ranking: 1,
        },
        {
            ID: 4,
            Ranking: 15,
        },
        {
            ID: 5,
            Ranking: 40,
        },
        {
            ID: 6,
            Ranking: 60,
        },
        {
            ID: 7,
            Ranking: 27,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#filter-top-50'));

    list = container.querySelector('#stats-table');
    listItems = list.querySelectorAll('tr');

    expect(list).not.toBeNull();
    expect(listItems.length).toBe(5);
});

// test sprawdza sortowanie po nazwie rosnąco
test('Sorting up by name works properly', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Avatar: 'https:avatar0.jpg',
            Nazwa: "username0",
        },
        {
            ID: 2,
            Avatar: 'https:avatar2.jpg',
            Nazwa: "username2",
        },
        {
            ID: 3,
            Avatar: 'https:avatar1.jpg',
            Nazwa: "username1",
        },
        {
            ID: 4,
            Avatar: 'https:avatar3.jpg',
            Nazwa: "username3",
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#sort-up-by-name'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    let personalinfo0 = listItems[0].querySelector('td:first-child'); //od pierwszego użytkownika (w już posortowanej liście)
    let personalinfo1 = listItems[1].querySelector('td:first-child'); //od drugiego użytkownika
    let personalinfo2 = listItems[2].querySelector('td:first-child');
    let personalinfo3 = listItems[3].querySelector('td:first-child');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[0].ID} <img src=\"https:avatar0.jpg\" width=\"50\" height=\"50\"> ${mock[0].Nazwa} `);
    expect(personalinfo1.innerHTML).toBe(`${mock[2].ID} <img src=\"https:avatar1.jpg\" width=\"50\" height=\"50\"> ${mock[2].Nazwa} `);
    expect(personalinfo2.innerHTML).toBe(`${mock[1].ID} <img src=\"https:avatar2.jpg\" width=\"50\" height=\"50\"> ${mock[1].Nazwa} `);
    expect(personalinfo3.innerHTML).toBe(`${mock[3].ID} <img src=\"https:avatar3.jpg\" width=\"50\" height=\"50\"> ${mock[3].Nazwa} `);
});

// test sprawdza sortowanie po nazwie malejąco
test('Sorting down by name works properly', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Avatar: 'https:avatar0.jpg',
            Nazwa: "username0",
        },
        {
            ID: 2,
            Avatar: 'https:avatar2.jpg',
            Nazwa: "username2",
        },
        {
            ID: 3,
            Avatar: 'https:avatar1.jpg',
            Nazwa: "username1",
        },
        {
            ID: 4,
            Avatar: 'https:avatar3.jpg',
            Nazwa: "username3",
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#sort-down-by-name'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    let personalinfo0 = listItems[0].querySelector('td:first-child'); //od pierwszego użytkownika (w już posortowanej liście)
    let personalinfo1 = listItems[1].querySelector('td:first-child'); //od drugiego użytkownika
    let personalinfo2 = listItems[2].querySelector('td:first-child');
    let personalinfo3 = listItems[3].querySelector('td:first-child');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[3].ID} <img src=\"https:avatar3.jpg\" width=\"50\" height=\"50\"> ${mock[3].Nazwa} `);
    expect(personalinfo1.innerHTML).toBe(`${mock[1].ID} <img src=\"https:avatar2.jpg\" width=\"50\" height=\"50\"> ${mock[1].Nazwa} `);
    expect(personalinfo2.innerHTML).toBe(`${mock[2].ID} <img src=\"https:avatar1.jpg\" width=\"50\" height=\"50\"> ${mock[2].Nazwa} `);
    expect(personalinfo3.innerHTML).toBe(`${mock[0].ID} <img src=\"https:avatar0.jpg\" width=\"50\" height=\"50\"> ${mock[0].Nazwa} `);
});

// test sprawdza sortowanie po rankingu rosnąco
test('Sorting up by ranking position works properly', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Ranking: 3,
        },
        {
            ID: 2,
            Ranking: 5,
        },
        {
            ID: 3,
            Ranking: 1,
        },
        {
            ID: 4,
            Ranking: 4,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#sort-up-by-rank'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    let personalinfo0 = listItems[0].querySelector('td:nth-child(2)'); //od pierwszego użytkownika (w już posortowanej liście)
    let personalinfo1 = listItems[1].querySelector('td:nth-child(2)'); //od drugiego użytkownika
    let personalinfo2 = listItems[2].querySelector('td:nth-child(2)');
    let personalinfo3 = listItems[3].querySelector('td:nth-child(2)');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[2].Ranking}`);
    expect(personalinfo1.innerHTML).toBe(`${mock[0].Ranking}`);
    expect(personalinfo2.innerHTML).toBe(`${mock[3].Ranking}`);
    expect(personalinfo3.innerHTML).toBe(`${mock[1].Ranking}`);
});

// test sprawdza sortowanie po rankingu malejąco
test('Sorting down by ranking position works properly', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Ranking: 3,
        },
        {
            ID: 2,
            Ranking: 5,
        },
        {
            ID: 3,
            Ranking: 1,
        },
        {
            ID: 4,
            Ranking: 4,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#sort-down-by-rank'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    let personalinfo0 = listItems[0].querySelector('td:nth-child(2)'); //od pierwszego użytkownika (w już posortowanej liście)
    let personalinfo1 = listItems[1].querySelector('td:nth-child(2)'); //od drugiego użytkownika
    let personalinfo2 = listItems[2].querySelector('td:nth-child(2)');
    let personalinfo3 = listItems[3].querySelector('td:nth-child(2)');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[1].Ranking}`);
    expect(personalinfo1.innerHTML).toBe(`${mock[3].Ranking}`);
    expect(personalinfo2.innerHTML).toBe(`${mock[0].Ranking}`);
    expect(personalinfo3.innerHTML).toBe(`${mock[2].Ranking}`);
});

// test sprawdza sortowanie po wygranych rosnąco
test('Sorting up by number of win games works properly', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Wygrane: 3,
            Remisy: 0,
            Przegrane: 1,
        },
        {
            ID: 2,
            Wygrane: 5,
            Remisy: 7,
            Przegrane: 5,
        },
        {
            ID: 3,
            Wygrane: 1,
            Remisy: 3,
            Przegrane: 0,
        },
        {
            ID: 4,
            Wygrane: 5,
            Remisy: 10,
            Przegrane: 100,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#sort-up-by-wins'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    let personalinfo0 = listItems[0].querySelector('td:last-child'); //od pierwszego użytkownika (w już posortowanej liście)
    let personalinfo1 = listItems[1].querySelector('td:last-child'); //od drugiego użytkownika
    let personalinfo2 = listItems[2].querySelector('td:last-child');
    let personalinfo3 = listItems[3].querySelector('td:last-child');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[2].Wygrane}/${mock[2].Remisy}/${mock[2].Przegrane}`);
    expect(personalinfo1.innerHTML).toBe(`${mock[0].Wygrane}/${mock[0].Remisy}/${mock[0].Przegrane}`);
    expect(personalinfo2.innerHTML).toBe(`${mock[1].Wygrane}/${mock[1].Remisy}/${mock[1].Przegrane}`);
    expect(personalinfo3.innerHTML).toBe(`${mock[3].Wygrane}/${mock[3].Remisy}/${mock[3].Przegrane}`);
});

// test sprawdza sortowanie po wygranych malejąco
test('Sorting down by number of win games works properly', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Wygrane: 3,
            Remisy: 0,
            Przegrane: 1,
        },
        {
            ID: 2,
            Wygrane: 5,
            Remisy: 7,
            Przegrane: 5,
        },
        {
            ID: 3,
            Wygrane: 1,
            Remisy: 3,
            Przegrane: 0,
        },
        {
            ID: 4,
            Wygrane: 5,
            Remisy: 10,
            Przegrane: 100,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#sort-down-by-wins'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    let personalinfo0 = listItems[0].querySelector('td:last-child'); //od pierwszego użytkownika (w już posortowanej liście)
    let personalinfo1 = listItems[1].querySelector('td:last-child'); //od drugiego użytkownika
    let personalinfo2 = listItems[2].querySelector('td:last-child');
    let personalinfo3 = listItems[3].querySelector('td:last-child');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[1].Wygrane}/${mock[1].Remisy}/${mock[1].Przegrane}`);
    expect(personalinfo1.innerHTML).toBe(`${mock[3].Wygrane}/${mock[3].Remisy}/${mock[3].Przegrane}`);
    expect(personalinfo2.innerHTML).toBe(`${mock[0].Wygrane}/${mock[0].Remisy}/${mock[0].Przegrane}`);
    expect(personalinfo3.innerHTML).toBe(`${mock[2].Wygrane}/${mock[2].Remisy}/${mock[2].Przegrane}`);
});

// test sprawdza sortowanie po remisach rosnąco
test('Sorting up by number of draws works properly', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Wygrane: 3,
            Remisy: 0,
            Przegrane: 1,
        },
        {
            ID: 2,
            Wygrane: 5,
            Remisy: 7,
            Przegrane: 5,
        },
        {
            ID: 3,
            Wygrane: 1,
            Remisy: 3,
            Przegrane: 0,
        },
        {
            ID: 4,
            Wygrane: 5,
            Remisy: 10,
            Przegrane: 100,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#sort-up-by-draws'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    let personalinfo0 = listItems[0].querySelector('td:last-child'); //od pierwszego użytkownika (w już posortowanej liście)
    let personalinfo1 = listItems[1].querySelector('td:last-child'); //od drugiego użytkownika
    let personalinfo2 = listItems[2].querySelector('td:last-child');
    let personalinfo3 = listItems[3].querySelector('td:last-child');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[0].Wygrane}/${mock[0].Remisy}/${mock[0].Przegrane}`);
    expect(personalinfo1.innerHTML).toBe(`${mock[2].Wygrane}/${mock[2].Remisy}/${mock[2].Przegrane}`);
    expect(personalinfo2.innerHTML).toBe(`${mock[1].Wygrane}/${mock[1].Remisy}/${mock[1].Przegrane}`);
    expect(personalinfo3.innerHTML).toBe(`${mock[3].Wygrane}/${mock[3].Remisy}/${mock[3].Przegrane}`);
});

// test sprawdza sortowanie po remisach malejąco
test('Sorting down by number of draws works properly', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Wygrane: 3,
            Remisy: 0,
            Przegrane: 1,
        },
        {
            ID: 2,
            Wygrane: 5,
            Remisy: 7,
            Przegrane: 5,
        },
        {
            ID: 3,
            Wygrane: 1,
            Remisy: 3,
            Przegrane: 0,
        },
        {
            ID: 4,
            Wygrane: 5,
            Remisy: 10,
            Przegrane: 100,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#sort-down-by-draws'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    let personalinfo0 = listItems[0].querySelector('td:last-child'); //od pierwszego użytkownika (w już posortowanej liście)
    let personalinfo1 = listItems[1].querySelector('td:last-child'); //od drugiego użytkownika
    let personalinfo2 = listItems[2].querySelector('td:last-child');
    let personalinfo3 = listItems[3].querySelector('td:last-child');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[3].Wygrane}/${mock[3].Remisy}/${mock[3].Przegrane}`);
    expect(personalinfo1.innerHTML).toBe(`${mock[1].Wygrane}/${mock[1].Remisy}/${mock[1].Przegrane}`);
    expect(personalinfo2.innerHTML).toBe(`${mock[2].Wygrane}/${mock[2].Remisy}/${mock[2].Przegrane}`);
    expect(personalinfo3.innerHTML).toBe(`${mock[0].Wygrane}/${mock[0].Remisy}/${mock[0].Przegrane}`);
});

// test sprawdza sortowanie po przegranych rosnąco
test('Sorting up by number of lost games works properly', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Wygrane: 3,
            Remisy: 0,
            Przegrane: 1,
        },
        {
            ID: 2,
            Wygrane: 5,
            Remisy: 7,
            Przegrane: 5,
        },
        {
            ID: 3,
            Wygrane: 1,
            Remisy: 3,
            Przegrane: 0,
        },
        {
            ID: 4,
            Wygrane: 5,
            Remisy: 10,
            Przegrane: 100,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#sort-up-by-lost'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    let personalinfo0 = listItems[0].querySelector('td:last-child'); //od pierwszego użytkownika (w już posortowanej liście)
    let personalinfo1 = listItems[1].querySelector('td:last-child'); //od drugiego użytkownika
    let personalinfo2 = listItems[2].querySelector('td:last-child');
    let personalinfo3 = listItems[3].querySelector('td:last-child');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[2].Wygrane}/${mock[2].Remisy}/${mock[2].Przegrane}`);
    expect(personalinfo1.innerHTML).toBe(`${mock[0].Wygrane}/${mock[0].Remisy}/${mock[0].Przegrane}`);
    expect(personalinfo2.innerHTML).toBe(`${mock[1].Wygrane}/${mock[1].Remisy}/${mock[1].Przegrane}`);
    expect(personalinfo3.innerHTML).toBe(`${mock[3].Wygrane}/${mock[3].Remisy}/${mock[3].Przegrane}`);
});

// test sprawdza sortowanie po przegranych malejąco
test('Sorting down by number of lost games works properly', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Wygrane: 3,
            Remisy: 0,
            Przegrane: 1,
        },
        {
            ID: 2,
            Wygrane: 5,
            Remisy: 7,
            Przegrane: 5,
        },
        {
            ID: 3,
            Wygrane: 1,
            Remisy: 3,
            Przegrane: 0,
        },
        {
            ID: 4,
            Wygrane: 5,
            Remisy: 10,
            Przegrane: 100,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#sort-down-by-lost'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    let personalinfo0 = listItems[0].querySelector('td:last-child'); //od pierwszego użytkownika (w już posortowanej liście)
    let personalinfo1 = listItems[1].querySelector('td:last-child'); //od drugiego użytkownika
    let personalinfo2 = listItems[2].querySelector('td:last-child');
    let personalinfo3 = listItems[3].querySelector('td:last-child');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[3].Wygrane}/${mock[3].Remisy}/${mock[3].Przegrane}`);
    expect(personalinfo1.innerHTML).toBe(`${mock[1].Wygrane}/${mock[1].Remisy}/${mock[1].Przegrane}`);
    expect(personalinfo2.innerHTML).toBe(`${mock[0].Wygrane}/${mock[0].Remisy}/${mock[0].Przegrane}`);
    expect(personalinfo3.innerHTML).toBe(`${mock[2].Wygrane}/${mock[2].Remisy}/${mock[2].Przegrane}`);
});

// test sprawdza czy pokazywanie wszystkich działa
test('Filter by all works properly', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Wygrane: 3,
            Remisy: 0,
            Przegrane: 1,
        },
        {
            ID: 2,
            Wygrane: 5,
            Remisy: 7,
            Przegrane: 5,
        },
        {
            ID: 3,
            Wygrane: 1,
            Remisy: 3,
            Przegrane: 0,
        },
        {
            ID: 4,
            Wygrane: 5,
            Remisy: 10,
            Przegrane: 100,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#filter-by-all'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    let personalinfo0 = listItems[0].querySelector('td:last-child'); //od pierwszego użytkownika (w już posortowanej liście)
    let personalinfo1 = listItems[1].querySelector('td:last-child'); //od drugiego użytkownika
    let personalinfo2 = listItems[2].querySelector('td:last-child');
    let personalinfo3 = listItems[3].querySelector('td:last-child');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[0].Wygrane}/${mock[0].Remisy}/${mock[0].Przegrane}`);
    expect(personalinfo1.innerHTML).toBe(`${mock[1].Wygrane}/${mock[1].Remisy}/${mock[1].Przegrane}`);
    expect(personalinfo2.innerHTML).toBe(`${mock[2].Wygrane}/${mock[2].Remisy}/${mock[2].Przegrane}`);
    expect(personalinfo3.innerHTML).toBe(`${mock[3].Wygrane}/${mock[3].Remisy}/${mock[3].Przegrane}`);
});

// test sprawdza czy złożenie kliku akcji działa: filtrowanie top 30, potem posortowanie po wygranych rosnąco (sprawdzenie), posortowanie po nazwie malejąco (sprawdzenie)
test('You can filter top 30 users, sort them up by win games and then sort them down by name still in top 30', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Nazwa: "Xyz",
            Ranking: 40,
            Wygrane: 3,
            Remisy: 0,
            Przegrane: 1,
        },
        {
            ID: 2,
            Nazwa: "Ujdf",
            Ranking: 3,
            Wygrane: 5,
            Remisy: 7,
            Przegrane: 5,
        },
        {
            ID: 3,
            Nazwa: "Absd",
            Ranking: 23,
            Wygrane: 1,
            Remisy: 3,
            Przegrane: 0,
        },
        {
            ID: 4,
            Nazwa: "Noc",
            Ranking: 52,
            Wygrane: 5,
            Remisy: 10,
            Przegrane: 100,
        },
        {
            ID: 5,
            Nazwa: "xOR",
            Ranking: 21,
            Wygrane: 13,
            Remisy: 1,
            Przegrane: 12,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#filter-top-30'));
    fireEvent.click(container.querySelector('#sort-up-by-wins'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    let personalinfo0 = listItems[0].querySelector('td:last-child'); //od pierwszego użytkownika (w już posortowanej liście)
    let personalinfo1 = listItems[1].querySelector('td:last-child'); //od drugiego użytkownika
    let personalinfo2 = listItems[2].querySelector('td:last-child');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[2].Wygrane}/${mock[2].Remisy}/${mock[2].Przegrane}`);
    expect(personalinfo1.innerHTML).toBe(`${mock[1].Wygrane}/${mock[1].Remisy}/${mock[1].Przegrane}`);
    expect(personalinfo2.innerHTML).toBe(`${mock[4].Wygrane}/${mock[4].Remisy}/${mock[4].Przegrane}`);

    fireEvent.click(container.querySelector('#sort-down-by-name'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    personalinfo0 = listItems[0].querySelector('td:first-child'); //od pierwszego użytkownika (w już posortowanej liście)
    personalinfo1 = listItems[1].querySelector('td:first-child'); //od drugiego użytkownika
    personalinfo2 = listItems[2].querySelector('td:first-child');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[4].ID} <img width=\"50\" height=\"50\"> ${mock[4].Nazwa} `);
    expect(personalinfo1.innerHTML).toBe(`${mock[1].ID} <img width=\"50\" height=\"50\"> ${mock[1].Nazwa} `);
    expect(personalinfo2.innerHTML).toBe(`${mock[2].ID} <img width=\"50\" height=\"50\"> ${mock[2].Nazwa} `);
});

// test sprawdza czy złożenie kliku akcji działa: filtrowanie top 30, potem filtrowanie top 50
test('You can filter top 30 users, then filter top 50 users', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Nazwa: "Xyz",
            Ranking: 40,
            Wygrane: 3,
            Remisy: 0,
            Przegrane: 1,
        },
        {
            ID: 2,
            Nazwa: "Ujdf",
            Ranking: 3,
            Wygrane: 5,
            Remisy: 7,
            Przegrane: 5,
        },
        {
            ID: 3,
            Nazwa: "Absd",
            Ranking: 23,
            Wygrane: 1,
            Remisy: 3,
            Przegrane: 0,
        },
        {
            ID: 4,
            Nazwa: "Noc",
            Ranking: 52,
            Wygrane: 5,
            Remisy: 10,
            Przegrane: 100,
        },
        {
            ID: 5,
            Nazwa: "xOR",
            Ranking: 21,
            Wygrane: 13,
            Remisy: 1,
            Przegrane: 12,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#filter-top-30'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze

    expect(listItems).not.toBeNull();
    expect(listItems.length).toBe(3);

    fireEvent.click(container.querySelector('#filter-top-50'));

    let list2 = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    let listItems2 = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    
    expect(listItems2).not.toBeNull();
    expect(listItems2.length).toBe(4);
});

// test sprawdza czy złożenie kliku akcji działa: filtrowanie top 30, potem posortowanie po wygranych rosnąco (sprawdzenie), posortowanie po nazwie malejąco (sprawdzenie)
test('You can filter top 30 users, sort them up by win games, then filter top 50 users and sort them down by name', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Nazwa: "Xyz",
            Ranking: 40,
            Wygrane: 3,
            Remisy: 0,
            Przegrane: 1,
        },
        {
            ID: 2,
            Nazwa: "Ujdf",
            Ranking: 3,
            Wygrane: 5,
            Remisy: 7,
            Przegrane: 5,
        },
        {
            ID: 3,
            Nazwa: "Absd",
            Ranking: 23,
            Wygrane: 1,
            Remisy: 3,
            Przegrane: 0,
        },
        {
            ID: 4,
            Nazwa: "Noc",
            Ranking: 52,
            Wygrane: 5,
            Remisy: 10,
            Przegrane: 100,
        },
        {
            ID: 5,
            Nazwa: "xOR",
            Ranking: 21,
            Wygrane: 13,
            Remisy: 1,
            Przegrane: 12,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(mock.length);

    fireEvent.click(container.querySelector('#filter-top-30'));
    fireEvent.click(container.querySelector('#sort-up-by-wins'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    let personalinfo0 = listItems[0].querySelector('td:last-child'); //od pierwszego użytkownika (w już posortowanej liście)
    let personalinfo1 = listItems[1].querySelector('td:last-child'); //od drugiego użytkownika
    let personalinfo2 = listItems[2].querySelector('td:last-child');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[2].Wygrane}/${mock[2].Remisy}/${mock[2].Przegrane}`);
    expect(personalinfo1.innerHTML).toBe(`${mock[1].Wygrane}/${mock[1].Remisy}/${mock[1].Przegrane}`);
    expect(personalinfo2.innerHTML).toBe(`${mock[4].Wygrane}/${mock[4].Remisy}/${mock[4].Przegrane}`);

    fireEvent.click(container.querySelector('#filter-top-50'));
    fireEvent.click(container.querySelector('#sort-down-by-name'));

    list = container.querySelector('#stats-table'); //cała tablica (już posortowana)
    listItems = list.querySelectorAll('tr'); //wybieram wszystkie wiersze
    personalinfo0 = listItems[0].querySelector('td:first-child'); //od pierwszego użytkownika (w już posortowanej liście)
    personalinfo1 = listItems[1].querySelector('td:first-child'); //od drugiego użytkownika
    personalinfo2 = listItems[2].querySelector('td:first-child');
    let personalinfo3 = listItems[3].querySelector('td:first-child');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[4].ID} <img width=\"50\" height=\"50\"> ${mock[4].Nazwa} `);
    expect(personalinfo1.innerHTML).toBe(`${mock[0].ID} <img width=\"50\" height=\"50\"> ${mock[0].Nazwa} `);
    expect(personalinfo2.innerHTML).toBe(`${mock[1].ID} <img width=\"50\" height=\"50\"> ${mock[1].Nazwa} `);
    expect(personalinfo3.innerHTML).toBe(`${mock[2].ID} <img width=\"50\" height=\"50\"> ${mock[2].Nazwa} `);
});

//jest 10 postów na stronie, tak jak zadeklarowano w Stats.js
test('number of posts per page is the same as defined', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
        },
        {
            ID: 2,
        },
        {
            ID: 3,
        },
        {
            ID: 4,
        },
        {
            ID: 5,
        },
        {
            ID: 6,
        },
        {
            ID: 7,
        },
        {
            ID: 8,
        },
        {
            ID: 9,
        },
        {
            ID: 10,
        },
        {
            ID: 11,
        },
        {
            ID: 12,
        },
        {
            ID: 13,
        },
        {
            ID: 14,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(10);
});

//można przejść do następnej strony
it('it is possible to go to the next page', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
        },
        {
            ID: 2,
        },
        {
            ID: 3,
        },
        {
            ID: 4,
        },
        {
            ID: 5,
        },
        {
            ID: 6,
        },
        {
            ID: 7,
        },
        {
            ID: 8,
        },
        {
            ID: 9,
        },
        {
            ID: 10,
        },
        {
            ID: 11,
        },
        {
            ID: 12,
        },
        {
            ID: 13,
        },
        {
            ID: 14,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    fireEvent.click(container.querySelector('#next-page'));

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(4);
});

//można przejść do następnej a potem do poprzedniej strony
it('it is possible to go to the next page and then go to the previous one', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
        },
        {
            ID: 2,
        },
        {
            ID: 3,
        },
        {
            ID: 4,
        },
        {
            ID: 5,
        },
        {
            ID: 6,
        },
        {
            ID: 7,
        },
        {
            ID: 8,
        },
        {
            ID: 9,
        },
        {
            ID: 10,
        },
        {
            ID: 11,
        },
        {
            ID: 12,
        },
        {
            ID: 13,
        },
        {
            ID: 14,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    fireEvent.click(container.querySelector('#next-page'));
    fireEvent.click(container.querySelector('#previous-page'));

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(10);
});

//nie da się przejść do wcześniejszej niż pierwsza strona
it('it is not possible to go to the previous page if you are on the first page', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
        },
        {
            ID: 2,
        },
        {
            ID: 3,
        },
        {
            ID: 4,
        },
        {
            ID: 5,
        },
        {
            ID: 6,
        },
        {
            ID: 7,
        },
        {
            ID: 8,
        },
        {
            ID: 9,
        },
        {
            ID: 10,
        },
        {
            ID: 11,
        },
        {
            ID: 12,
        },
        {
            ID: 13,
        },
        {
            ID: 14,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    fireEvent.click(container.querySelector('#previous-page'));

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(10);
});

//nie da się przejść do dalszej strony niż ostatnia
it('it is not possible to go to the next page if you are on the last page', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
        },
        {
            ID: 2,
        },
        {
            ID: 3,
        },
        {
            ID: 4,
        },
        {
            ID: 5,
        },
        {
            ID: 6,
        },
        {
            ID: 7,
        },
        {
            ID: 8,
        },
        {
            ID: 9,
        },
        {
            ID: 10,
        },
        {
            ID: 11,
        },
        {
            ID: 12,
        },
        {
            ID: 13,
        },
        {
            ID: 14,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    fireEvent.click(container.querySelector('#next-page'));
    fireEvent.click(container.querySelector('#next-page'));

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();
    expect(listItems.length).toBe(4);
});

//testowanie złożenia kilku akcji
it('it is possible to filter top 50 users, sort them up by ranking position and go to the next page after sorting', async () => {
    jest.mock("axios");
    axios.get = jest.fn();

    let mock = [
        {
            ID: 1,
            Ranking: 5,
        },
        {
            ID: 2,
            Ranking: 40,
        },
        {
            ID: 3,
            Ranking: 24,
        },
        {
            ID: 4,
            Ranking: 31,
        },
        {
            ID: 5,
            Ranking: 20,
        },
        {
            ID: 6,
            Ranking: 3,
        },
        {
            ID: 7,
            Ranking: 17,
        },
        {
            ID: 8,
            Ranking: 43,
        },
        {
            ID: 9,
            Ranking: 100,
        },
        {
            ID: 10,
            Ranking: 28,
        },
        {
            ID: 11,
            Ranking: 19,
        },
        {
            ID: 12,
            Ranking: 70,
        },
        {
            ID: 13,
            Ranking: 120,
        },
        {
            ID: 14,
            Ranking: 45,
        }
    ];

    await act(async () => {
        await axios.get.mockImplementationOnce(() => Promise.resolve({
            data: mock
        }));
        ReactDOM.render(<Stats effect={100}/>, container);
    });

    let list = container.querySelector('#stats-table');
    let listItems = list.querySelectorAll('tr');
    expect(list).not.toBeNull();

    fireEvent.click(container.querySelector('#filter-top-50'));
    fireEvent.click(container.querySelector('#sort-up-by-rank'));

    fireEvent.click(container.querySelector('#next-page'));

    list = container.querySelector('#stats-table'); 
    listItems = list.querySelectorAll('tr'); 
    let personalinfo0 = listItems[0].querySelector('td:nth-child(2)');

    expect(listItems).not.toBeNull();
    expect(personalinfo0.innerHTML).toBe(`${mock[13].Ranking}`);
});