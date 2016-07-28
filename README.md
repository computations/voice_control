#Javascript English to robot command parser

##Goals

The goal of this project is to produce an interface between a speech to text
program and the RobotMoose javascript control program. The input to this
program are statements like

> Hey robot please drive forward 10 feet and then turn left

Which will produce the output

```javascript
forward(304.8);
left(90);
```

For more a more detailed explanation of valid statements, please refer to the
grammar section. But, generally, anything of the form of the statement above
should work, including other units, like meters, radians, or degrees.

###Grammar

Take this as more of a rough draft of the grammar, as the parser has grown past
this.

```
COMMAND: ALERT ACTION

ALERT: hey ROBOT_NAME

ACTION: DRIVE_ACTION
      | TURN_ACTION

DRIVE_ACTION: drive DRIVE_SPECS

TURN_ACTION: turn TURN_SPECS

DRIVE_SPECS: DRIVE_DIRECTION DISTANCE
           | DISTANCE DRIVE_DIRECTION

DRIVE_DIRECTION: forward
               | backwards
               | left
               | right

TURN_SPECS: ANGLE TURN_DIRECTION
          | TURN_DIRECTION ANGLE
          | ANGLE
          | DIRECTION

TURN_DIRECTION: left
              | right
              | backwards
              | around

ANGLE: NUMBER degrees
     | NUMBER radians

DISTANCE: NUMBER feet
        | NUMBER meters
        | NUMBER centimeters
```
