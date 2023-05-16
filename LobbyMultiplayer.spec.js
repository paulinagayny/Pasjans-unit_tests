import React from "react";
import ReactDOM from 'react-dom';
import {act} from "react-dom/test-utils";
import socket from './socketConfig';
import SocketMock from 'socket.io-mock';
import {fireEvent} from "@testing-library/react";
import LobbyMultiplayer from "./LobbyMultiplayer";
import {BrowserRouter} from 'react-router-dom';

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

// ta funckja będzie wykonywała się po każdym teście
afterEach(() => {
    // usuwam z dokumentu kontener
    // a nastepnie zawartyość jego zmiennej
    // zabopeignie to problemów z
    // renderowaniem przy każdym teście
    document.body.removeChild(container);
    container = null;
});
// Od kierowniczki
test('Export room on start', () => {
    // definuje że socket bedzie mockowany
    jest.mock('./socketConfig');
    // mowie co konkretnie bedzie mockowane
    socket.emit = jest.fn();

    act(() => {
        ReactDOM.render(<BrowserRouter><LobbyMultiplayer/></BrowserRouter>, container);
    });

    expect(socket.emit).toHaveBeenCalledWith("export-users");
});
// Od kierowniczki
test('The number of rooms is consistent with the number of elements', () => {
    act(() => {
        ReactDOM.render(<BrowserRouter><LobbyMultiplayer/></BrowserRouter>, container);
    });

    // definuje że socket bedzie mockowany
    jest.mock('./socketConfig');

    // Z każdym nowym pokojem tworzony jest element z klasą row1
    // Więc zbieram wszystkie elementy o takich klasach
    let roomRows = container.querySelectorAll('.row1');

    // Tworzę tablicę użytkowników
    // Pierwszy (0) użytkownik ląduje do pokoju z numerem 2, tak jak Drugi (1)
    // a Trzeci (2) ląduję do pokoju nr 3
    const usersArray = [{room: 2}, {room: 2}, {room: 3}]

    socket.emit('pass-users', usersArray);

    socket.on('pass-users', () => {
        //  Czy wyrenderowały się 2 pokoje? (o numerze 2 i o numerze 3)
        expect(roomRows.length).toBe(2);

        //  Czy pierwszy ma numer 2?
        expect(roomRows[0].querySelector('.Name').innerHTML).toBe('2');
        //  Czy jest 2 użytkowników?
        expect(roomRows[0].querySelector('.Ppl1').innerHTML).toBe('2');

        expect(roomRows[1].querySelector('.Name').innerHTML).toBe('3');
        expect(roomRows[1].querySelector('.Name').innerHTML).toBe('1');
    });
});

//corrected version of givem example test: (in the given test no events were actually sent, so it for example expect(2).toBe(3) can pass)
//correction was based on what Gabriela did in example tests in other scripts (such as JoinRoom.spec.js)
test('Corrected version: The number of rooms is consistent with the number of elements', () => {
    jest.mock('./socketConfig.js');
    socket.on = jest.fn();
    socket.emit = jest.fn();

    let socketMock = new SocketMock();

    socket.emit.mockImplementation((eventKey, ...args) => {
        socketMock.socketClient.emit(eventKey, ...args)
    });
    socket.on.mockImplementation((evt, cb) => {
        socketMock.on(evt, cb)
    });

    act(() => {
        ReactDOM.render(<BrowserRouter><LobbyMultiplayer/></BrowserRouter>, container);
    });

    const usersArray = [{room: 2}, {room: 2}, {room: 3}];
    socket.emit('pass-users', usersArray);

    let roomRows = container.querySelectorAll('.row1');
    
    socket.on('pass-users', () => {
        expect(roomRows.length).toBe(2);

        expect(roomRows[0].querySelector('.Name').innerHTML).toBe('2');
        expect(roomRows[0].querySelector('.Ppl1').innerHTML).toBe('2');

        expect(roomRows[1].querySelector('.Name').innerHTML).toBe('3');
    });
});

test('Clicking create room button results in moving to create room window', () => {

    act(() => {
        ReactDOM.render(<BrowserRouter><LobbyMultiplayer/></BrowserRouter>, container);
    });

    var pathname = window.location.pathname;
    
    expect(pathname).not.toEqual("/create-room"); //it would be better to first emit an event such as start, to fix the pathname so we know it for sure, not to take chances, but I think it would require access to JoinRoom.js script and maybe it wouldn't be neccesary a good thing to do it in unit tests

    fireEvent.click(container.querySelector('#create-room-btn')); //clicking the button

    pathname = window.location.pathname;

    expect(pathname).toEqual("/create-room"); //current window is /create-room
});


test('Clicking join room button results in moving to game lobby window', () => {

    jest.mock('./socketConfig.js');
    socket.on = jest.fn();
    socket.emit = jest.fn();

    let socketMock2 = new SocketMock();

    socket.emit.mockImplementation((eventKey, ...args) => {
        socketMock2.socketClient.emit(eventKey, ...args)
    });
    socket.on.mockImplementation((evt, cb) => {
        socketMock2.on(evt, cb)
    });

    act(() => {
        ReactDOM.render(<BrowserRouter><LobbyMultiplayer/></BrowserRouter>, container);
    });

    var pathname = window.location.pathname;

    pathname = window.location.pathname;

    expect(pathname).not.toEqual("/game-lobby"); //current window is not /game-lobby

    const usersArray = [{room: 2}];

    socket.emit('pass-users', usersArray);

    socket.on('pass-users', () => {
        let roomRows = container.querySelectorAll('.row1');
        
        expect(roomRows.length).toBe(1);

        expect(roomRows[0].querySelector('.Name').innerHTML).toBe('2');
        expect(roomRows[0].querySelector('.Ppl1').innerHTML).toBe('1');

        fireEvent.click(container.querySelector('#join-btn')); //clicking the button

        expect(pathname).toEqual("/game-lobby"); //current window is /game-lobby
    });

});

//there is something wrong, for me it seems like not everything is being cleaned up after each test