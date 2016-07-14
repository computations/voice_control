#English to JS grammar

##Tokens

```
HEY: hey
ROBOT_NAME: voiceable_id
```

##Grammar

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
