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

DRIVE_ACTION: drive DIRECTION DISTANCE
            | drive DISTANCE DIRECTION

TURN_ACTION: turn DIRECTION ANGLE
           | turn ANGLE DIRECTION
           | turn DIRECTION

DIRECTION: forward
         | left
         | right
         | back
         | backwards
         |

ANGLE: NUMBER degrees
     | NUMBER radians

DISTANCE: NUMBER feet
        | NUMBER meters
        | NUMBER centimeters

```
