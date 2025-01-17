const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {
  let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
  let normalModeCommand = [new Command('MODE_CHANGE', 'NORMAL')];
  let normalMode = new Message('Mode change test', normalModeCommand);
  let moveCommand = [new Command('MOVE',4321)];
  let moveMessage = new Message('Move command test', moveCommand);
  let message = new Message('Test message with two commands', commands);
  let rover = new Rover(98382);
  
  let response = rover.receiveMessage(message);


  it("constructor sets position and default values for mode and generatorWatts", function() {
    expect((new Rover(1)).position).toBe(1);
    expect((new Rover(1)).mode).toBe('NORMAL');
    expect((new Rover(1)).generatorWatts).toBe(110);
  });

  it("response returned by receiveMessage contains the name of the message", function() {
    expect(response.message).toContain(message.name); 
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    expect(response.results.length).toBe(2);
  });

  it("responds correctly to the status check command", function() {
    expect((response.results)[1].completed).toBe(true);
    expect((response.results)[1].roverStatus.mode).toBe('LOW_POWER');
    expect((response.results)[1].roverStatus.generatorWatts).toBe(110);
    expect((response.results)[1].roverStatus.position).toBe(98382); 
  });//1 index of status check in array

  it("responds correctly to the mode change command", function() {
    expect((response.results)[0].completed).toBe(true);
    expect(new Rover(0).mode).toBe('NORMAL');
    expect(rover.mode).toBe('LOW_POWER');
    rover.receiveMessage(normalMode);
    expect(rover.mode).toBe('NORMAL');
  });//0 is index of mode change in array

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function() {
    rover.receiveMessage(message);
    expect((rover.receiveMessage(moveMessage).results)[0].completed).toBe(false);
  });

  it("responds with the position for the move command", function() {
    rover.receiveMessage(normalMode);    
    expect((rover.receiveMessage(moveMessage).results)[0].completed).toBe(true);
    rover.receiveMessage(moveMessage); 
    expect(rover.position).toBe(4321);
  });

});