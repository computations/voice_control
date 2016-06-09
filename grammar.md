#English to JS grammar

```
COMMAND: ALERT ACTION

ALERT: hey ROBOT_NAME

ACTION: DRIVE_ACTION
      | TURN_ACTION

DRIVE_ACTION: drive DIRECTION DISTANCE
            | drive DISTANCE DIRECTION
            | drive DISTANCE

TURN_ACTION: turn DIRECTION ANGLE
           | turn ANGLE DIRECTION
           | turn DIRECTION

DIRECTION: forward
         | left
         | right
         | back
         | backwards

ANGLE: NUMBER degrees
     | NUMBER radians

DISTANCE: NUMBER feet
        | NUMBER meters
        | NUMBER centimeters

```
