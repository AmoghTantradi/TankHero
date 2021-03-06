module.exports = {

    PORT: 9000,

    FPS: 60.0,

    WIDTH: 800.0,

    HEIGHT: 600.0,

    MAX_PLAYERS:2, //HAS TO BE AN EVEN NUMBER for production

    CHECKPOINT_RADIUS: 60.0,

    CHECKPOINT_DELAY: 5000.0, // 5 seconds

    CHECKPOINT_NUMBER:1,

    CHECKPOINT_DEFAULT_COLOR:'orange',

    TANK_DEFAULT_COLOR:'brown',

    TANK_DEFAULT_CENTER_X:400.0,
    TANK_DEFAULT_CENTER_Y:300.0,

    TANK_THETA: 0.0,
    TANK_DTHETA: 1.0,

    TANK_SPEED: 1.75,

    TANK_MAX_HEALTH: 100.0,
    TANK_DAMAGE: 10.0,

    TANK_WIDTH:40.0,
    TANK_HEIGHT: 20.0,
    
    TANK_RELOAD_TIME: 1000.0,
    TANK_RESPAWN_TIME: 10000.0,

    TURRET_DEFAULT_COLOR:'green',

    TURRET_WIDTH: 20.0,
    TURRET_HEIGHT: 20.0,
    TURRET_DTHETA:2.0,

    BULLET_SPEED: 1.00,
    BULLET_WIDTH: 5.0,
    BULLET_HEIGHT: 5.0,
    
    BULLET_DEFAULT_COLOR:'red',

    CHECKPOINT_PROGRESSBAR_COLOR:'seagreen',

    PLAYER_HEALTHBAR_COLOR:'blue',

    PLAYER_NAME_COLOR: 'black',

    SOCKET_CONNECT:'connection',
    SOCKET_DISCONNECT:'disconnect',
    SOCKET_NEW_PLAYER:'newPlayer',
    SOCKET_MOVEMENT:'movement',
    SOCKET_MSG:'msg',
    SOCKET_GAME_DATA:'gameData',
    SOCKET_STATE:'state'
    
    
}