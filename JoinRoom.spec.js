import React from "react";
import ReactDOM from 'react-dom';
import {act} from "react-dom/test-utils";
import JoinRoom from "./JoinRoom";
import {BrowserRouter} from 'react-router-dom';
import SocketMock from 'socket.io-mock';
import socket from './../socketConfig';
import {fireEvent} from "@testing-library/react";

// tworzę zmienna na konterner
// wyrederowana treść komponentów bedzie znajdowana się tutaj
let container;

const socketMock = new SocketMock();

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

test('Export room on start', () => {
    // definuje że socket bedzie mockowany
    jest.mock('./../socketConfig.js');
    // mowie co konkretnie bedzie mockowane
    socket.emit = jest.fn();

    act(() => {
        ReactDOM.render(<BrowserRouter><JoinRoom/></BrowserRouter>, container);
    });

    expect(socket.emit).toHaveBeenCalledWith("export-room");
});//not mine

test('User can be kicked', () => {
    jest.mock('./../socketConfig.js');
    socket.on = jest.fn();
    socket.emit = jest.fn();

    socket.emit.mockImplementation((eventKey, ...args) => {
        socketMock.socketClient.emit(eventKey, ...args)
    });
    socket.on.mockImplementation((evt, cb) => {
        socketMock.on(evt, cb)
    });

    act(() => {
        ReactDOM.render(<BrowserRouter><JoinRoom/></BrowserRouter>, container);
    });

    let lobbyModal = container.querySelector('.lobby__modal-container');
    expect(lobbyModal.classList.contains('active')).toBeFalsy();

    socket.on('kicked', () => {
        console.log(lobbyModal.classList.toString())
        expect(lobbyModal.classList.contains('active')).toBeTruthy();
    });

    socket.emit('kicked');
});//not mine

test('Export room on start', () => {
    // definuje że socket bedzie mockowany
    jest.mock('./../socketConfig.js');
    // mowie co konkretnie bedzie mockowane
    socket.emit = jest.fn();

    act(() => {
        ReactDOM.render(<BrowserRouter><JoinRoom/></BrowserRouter>, container);
    });

    expect(socket.emit).toHaveBeenCalledWith("export-room");
});//not mine

test('Inintial data (room name, empty array for players) is properly set before joining the room', () => {
    jest.mock('./../socketConfig.js');
    socket.on = jest.fn();
    socket.emit = jest.fn();

    socket.emit.mockImplementation((eventKey, ...args) => {
        socketMock.socketClient.emit(eventKey, ...args)
    });
    socket.on.mockImplementation((evt, cb) => {
        socketMock.on(evt, cb)
    });

    act(() => {
        ReactDOM.render(<BrowserRouter><JoinRoom/></BrowserRouter>, container);
    });

    //room's name
    let list = container.querySelector('#lobby__created-data_name');
    expect(list).not.toBeNull();

    let listItems = list.querySelectorAll('p');
    expect(listItems.length).toBe(2); //"Nazwa" tag and the room's name

    let room_name = listItems[1].innerHTML;
    expect(room_name).toEqual('test');
    
    //players array
    list = container.querySelector('#lobby__created-data_players');
    expect(list).not.toBeNull();

    listItems = list.querySelectorAll('ul');
    expect(listItems.length).toBe(1);

    let players = listItems[0].innerHTML;
    expect(players).toBe("");
});

test('It is possible to start a room; Current window has changed to game view', () => {
    jest.mock('./../socketConfig.js');
    socket.on = jest.fn();
    socket.emit = jest.fn();

    socket.emit.mockImplementation((eventKey, ...args) => {
        socketMock.socketClient.emit(eventKey, ...args)
    });
    socket.on.mockImplementation((evt, cb) => {
        socketMock.on(evt, cb)
    });

    act(() => {
        ReactDOM.render(<BrowserRouter><JoinRoom/></BrowserRouter>, container);
    });
    

    socket.on('start', (time) => {

        var pathname = window.location.pathname;

        expect(pathname).toEqual("/game-view");
    });

    socket.emit('start', (3000)); //3000 is some "time"
});

test('It is possible to update Room"s state', () => {
    jest.mock('./../socketConfig.js');
    socket.on = jest.fn();
    socket.emit = jest.fn();

    socket.emit.mockImplementation((eventKey, ...args) => {
        socketMock.socketClient.emit(eventKey, ...args)
    });
    socket.on.mockImplementation((evt, cb) => {
        socketMock.on(evt, cb)
    });

    act(() => {
        ReactDOM.render(<BrowserRouter><JoinRoom/></BrowserRouter>, container);
    });

    socket.on('pass-room', ({room, users}) => {

    //room's name
    let list = container.querySelector('#lobby__created-data_name');
    expect(list).not.toBeNull();

    let listItems = list.querySelectorAll('p');
    expect(listItems.length).toBe(2); //"Nazwa" tag and the room's name

    let room_name = listItems[1].innerHTML;
    expect(room_name).toEqual('room_updated');
    
    //players array
    list = container.querySelector('#lobby__created-data_players');
    expect(list).not.toBeNull();

    listItems = list.querySelectorAll('ul');
    expect(listItems.length).toBe(1);

    let players = listItems[0].innerHTML;
    expect(players).not.toBe(""); //it is a sign that something changed; it is no longer an empty array. I believe that in this very moment players "exist" so in the original script, in "lobby_created-data" class, so they can be mapped into player rows. Thus it is no longer an empty string. However it is just my assumption - I think it would be better to use "real fake" players in this test.
    });

    let room_2 = {room: "room_updated", users: "players_update"};

    socket.emit('pass-room', room_2); 
});

test('It is possible to accept a new multiplayer game after being kicked out', () => {
    jest.mock('./../socketConfig.js');
    socket.on = jest.fn();
    socket.emit = jest.fn();

    socket.emit.mockImplementation((eventKey, ...args) => {
        socketMock.socketClient.emit(eventKey, ...args)
    });
    socket.on.mockImplementation((evt, cb) => {
        socketMock.on(evt, cb)
    });

    act(() => {
        ReactDOM.render(<BrowserRouter><JoinRoom/></BrowserRouter>, container);
    });
    
    socket.on('kicked', () => {
        //checking the possibilty to join a new multiplayer game after being kicked out - window changes after clicking a button
        fireEvent.click(container.querySelector('#accept-multiplayer-game')); //clicking the button

        var pathname = window.location.pathname;

        expect(pathname).toEqual("/multiplayer"); //current window is now multiplayer instead of - for example - game view
    });

    socket.emit('kicked');
});

test('It is possible to leave the lobby (and join the multiplayer room I suppose)', () => {
    jest.mock('./../socketConfig.js');
    socket.on = jest.fn();
    socket.emit = jest.fn();

    socket.emit.mockImplementation((eventKey, ...args) => {
        socketMock.socketClient.emit(eventKey, ...args)
    });
    socket.on.mockImplementation((evt, cb) => {
        socketMock.on(evt, cb)
    });

    act(() => {
        ReactDOM.render(<BrowserRouter><JoinRoom/></BrowserRouter>, container);
    });
    
    socket.emit('start', (3000)); //I'm doing it to set the current window to game view

    var pathname = window.location.pathname;
    expect(pathname).toEqual("/game-view");

    fireEvent.click(container.querySelector('#lobby-leave')); //clicking the button

    pathname = window.location.pathname;

    expect(pathname).toEqual("/multiplayer"); //current window is now multiplayer
});