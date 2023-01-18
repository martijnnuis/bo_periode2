const FPS = 30; 
const frictie = 0.7;
const levens = 3; 
const lazer_afstand = 0.6;
const lazer_ontplof_tijd = 0.1; 
const maximale_lazers = 10; 
const lazer_snelheid = 500; 
const komeet_onevenheid = 0.4; 
const komeet_punten_groot = 20; 
const komeet_punten_tussenin = 50; 
const komeet_punten_klijn = 100; 
const komeet_aantal = 3; 
const komeet_grote = 100; 
const komeet_snelheid = 50; 
const komeet_teken_punten = 10; 
const opslag_sleutel_punten = "highscore"; 
const schip_knipper_tijd = 0.1; 
const schip_ontplof_tijd = 0.3; 
const schip_geen_dmg_tijd = 3; 
const schip_grote = 30; 
const schip_kracht = 5; 
const schip_draai_snelheid = 360;
const laat_hitbox_zien = false; 
const laat_midde_zien = false; 
const text_verdwijn_tijd = 2.5; 
const text_grote = 40; 

/** @type {HTMLCanvasElement} */
var canv = document.getElementById("gameCanvas");
var ctx = canv.getContext("2d");


var niveau, levens_2, kometen, punten, topscore, schip, text, textAlpha;
nieuw_spel();


document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);


setInterval(update, 1000 / FPS);

function maak_meerdere_astroides() {
    kometen = [];
    var x, y;
    for (var i = 0; i < komeet_aantal + niveau; i++) {
        do {
            x = Math.floor(Math.random() * canv.width);
            y = Math.floor(Math.random() * canv.height);
        } while (afstand_tussen_punten(schip.x, schip.y, x, y) < komeet_grote * 2 + schip.r);
        kometen.push(nieuwe_komeet(x, y, Math.ceil(komeet_grote / 2)));
    }
}

function breek_asrtoide(index) {
    var x = kometen[index].x;
    var y = kometen[index].y;
    var r = kometen[index].r;


    if (r == Math.ceil(komeet_grote / 2)) { 
        kometen.push(nieuwe_komeet(x, y, Math.ceil(komeet_grote / 4)));
        kometen.push(nieuwe_komeet(x, y, Math.ceil(komeet_grote / 4)));
        punten += komeet_punten_groot;
    } else if (r == Math.ceil(komeet_grote / 4)) { 
        kometen.push(nieuwe_komeet(x, y, Math.ceil(komeet_grote / 8)));
        kometen.push(nieuwe_komeet(x, y, Math.ceil(komeet_grote / 8)));
        punten += komeet_punten_tussenin;
    } else {
        punten += komeet_punten_klijn;
    }


    if (punten > topscore) {
        topscore = punten;
        localStorage.setItem(opslag_sleutel_punten, topscore);
    }


    kometen.splice(index, 1);


    if (kometen.length == 0) {
        niveau++;
        nieuw_level();
    }
}

function afstand_tussen_punten(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function teken_schip(x, y, a, colour = "white") {
    ctx.strokeStyle = colour;
    ctx.lineWidth = schip_grote / 20;
    ctx.beginPath();
    ctx.moveTo( 
        x + 4 / 3 * schip.r * Math.cos(a),
        y - 4 / 3 * schip.r * Math.sin(a)
    );
    ctx.lineTo( 
        x - schip.r * (2 / 3 * Math.cos(a) + Math.sin(a)),
        y + schip.r * (2 / 3 * Math.sin(a) - Math.cos(a))
    );
    ctx.lineTo( 
        x - schip.r * (2 / 3 * Math.cos(a) - Math.sin(a)),
        y + schip.r * (2 / 3 * Math.sin(a) + Math.cos(a))
    );
    ctx.closePath();
    ctx.stroke();
}

function schip_explosie() {
    schip.explodeTime = Math.ceil(schip_ontplof_tijd * FPS);
}

function gameOver() {
    schip.dead = true;
    text = "Game Over";
    textAlpha = 1.0;
}

function keyDown(/** @type {KeyboardEvent} */ ev) {

    if (schip.dead) {
        return;
    }

    switch(ev.keyCode) {
        case 16:
            schiet_lazer();
            break;
        case 65:
            schip.rot = schip_draai_snelheid / 180 * Math.PI / FPS;
            break;
        case 87:
            schip.thrusting = true;
            break;
        case 68:
            schip.rot = -schip_draai_snelheid / 180 * Math.PI / FPS;
            break;
    }
}

function keyUp(/** @type {KeyboardEvent} */ ev) {

    if (schip.dead) {
        return;
    }

    switch(ev.keyCode) {
        case 16:
            schip.canShoot = true;
            break;
        case 65:
            schip.rot = 0;
            break;
        case 87:
            schip.thrusting = false;
            break;
        case 68:
            schip.rot = 0;
            break;
    }
}

function nieuwe_komeet(x, y, r) {
    var lvlMult = 1 + 0.1 * niveau;
    var komeet = {
        x: x,
        y: y,
        xv: Math.random() * komeet_snelheid * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1),
        yv: Math.random() * komeet_snelheid * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1),
        a: Math.random() * Math.PI * 2, // in radians
        r: r,
        offs: [],
        vert: Math.floor(Math.random() * (komeet_teken_punten + 1) + komeet_teken_punten / 2)
    };

for (var i = 0; i < komeet.vert; i++) {
        komeet.offs.push(Math.random() * komeet_onevenheid * 2 + 1 - komeet_onevenheid);
    }

    return komeet;
}

function nieuw_spel() {
    niveau = 0;
    levens = levens;
    punten = 0;
    schip = nieuw_schip();


    var scoreStr = localStorage.getItem(opslag_sleutel_punten);
    if (scoreStr == null) {
        topscore = 0;
    } else {
        topscore = parseInt(scoreStr);
    }

    nieuw_level();
}

function nieuw_level() {
    text = "Level " + (niveau + 1);
    textAlpha = 1.0;
    maak_meerdere_astroides();
}

function nieuw_schip() {
    return {
        x: canv.width / 2,
        y: canv.height / 2,
        a: 90 / 180 * Math.PI, 
        r: schip_grote / 2,
        blinkNum: Math.ceil(schip_geen_dmg_tijd / schip_knipper_tijd),
        blinkTime: Math.ceil(schip_knipper_tijd * FPS),
        canShoot: true,
        dead: false,
        explodeTime: 0,
        lasers: [],
        rot: 0,
        thrusting: false,
        thrust: {
            x: 0,
            y: 0
        }
    }
}

function schiet_lazer() {

    if (schip.canShoot && schip.lasers.length < maximale_lazers) {
        schip.lasers.push({
            x: schip.x + 4 / 3 * schip.r * Math.cos(schip.a),
            y: schip.y - 4 / 3 * schip.r * Math.sin(schip.a),
            xv: lazer_snelheid * Math.cos(schip.a) / FPS,
            yv: -lazer_snelheid * Math.sin(schip.a) / FPS,
            dist: 0,
            explodeTime: 0
        });
    }


    schip.canShoot = false;
}

function update() {
    var blinkOn = schip.blinkNum % 2 == 0;
    var exploding = schip.explodeTime > 0;


    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);


    var a, r, x, y, offs, vert;
    for (var i = 0; i < kometen.length; i++) {
        ctx.strokeStyle = "slategrey";
        ctx.lineWidth = schip_grote / 20;


        a = kometen[i].a;
        r = kometen[i].r;
        x = kometen[i].x;
        y = kometen[i].y;
        offs = kometen[i].offs;
        vert = kometen[i].vert;
        

        ctx.beginPath();
        ctx.moveTo(
            x + r * offs[0] * Math.cos(a),
            y + r * offs[0] * Math.sin(a)
        );


        for (var j = 1; j < vert; j++) {
            ctx.lineTo(
                x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
            );
        }
        ctx.closePath();
        ctx.stroke();


        if (laat_hitbox_zien) {
            ctx.strokeStyle = "lime";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, false);
            ctx.stroke();
        }
    }
    

    if (schip.thrusting && !schip.dead) {
        schip.thrust.x += schip_kracht * Math.cos(schip.a) / FPS;
        schip.thrust.y -= schip_kracht * Math.sin(schip.a) / FPS;


        if (!exploding && blinkOn) {
            ctx.fillStyle = "red";
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = schip_grote / 10;
            ctx.beginPath();
            ctx.moveTo( 
                schip.x - schip.r * (2 / 3 * Math.cos(schip.a) + 0.5 * Math.sin(schip.a)),
                schip.y + schip.r * (2 / 3 * Math.sin(schip.a) - 0.5 * Math.cos(schip.a))
            );
            ctx.lineTo( 
                schip.x - schip.r * 5 / 3 * Math.cos(schip.a),
                schip.y + schip.r * 5 / 3 * Math.sin(schip.a)
            );
            ctx.lineTo( 
                schip.x - schip.r * (2 / 3 * Math.cos(schip.a) - 0.5 * Math.sin(schip.a)),
                schip.y + schip.r * (2 / 3 * Math.sin(schip.a) + 0.5 * Math.cos(schip.a))
            );
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    } else {
        
        schip.thrust.x -= frictie * schip.thrust.x / FPS;
        schip.thrust.y -= frictie * schip.thrust.y / FPS;
    }
    
    
    if (!exploding) {
        if (blinkOn && !schip.dead) {
            teken_schip(schip.x, schip.y, schip.a);
        }

        
        if (schip.blinkNum > 0) {

        
            schip.blinkTime--;

        
            if (schip.blinkTime == 0) {
                schip.blinkTime = Math.ceil(schip_knipper_tijd * FPS);
                schip.blinkNum--;
            }
        }
    } else {
        
        ctx.fillStyle = "darkred";
        ctx.beginPath();
        ctx.arc(schip.x, schip.y, schip.r * 1.7, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(schip.x, schip.y, schip.r * 1.4, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(schip.x, schip.y, schip.r * 1.1, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(schip.x, schip.y, schip.r * 0.8, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(schip.x, schip.y, schip.r * 0.5, 0, Math.PI * 2, false);
        ctx.fill();
    }

    
    if (laat_hitbox_zien) {
        ctx.strokeStyle = "lime";
        ctx.beginPath();
        ctx.arc(schip.x, schip.y, schip.r, 0, Math.PI * 2, false);
        ctx.stroke();
    }
    
    
    if (laat_midde_zien) {
        ctx.fillStyle = "red";
        ctx.fillRect(schip.x - 1, schip.y - 1, 2, 2);
    }

    
    for (var i = 0; i < schip.lasers.length; i++) {
        if (schip.lasers[i].explodeTime == 0) {
            ctx.fillStyle = "salmon";
            ctx.beginPath();
            ctx.arc(schip.lasers[i].x, schip.lasers[i].y, schip_grote / 15, 0, Math.PI * 2, false);
            ctx.fill();
        } else {
    
            ctx.fillStyle = "orangered";
            ctx.beginPath();
            ctx.arc(schip.lasers[i].x, schip.lasers[i].y, schip.r * 0.75, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "salmon";
            ctx.beginPath();
            ctx.arc(schip.lasers[i].x, schip.lasers[i].y, schip.r * 0.5, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "pink";
            ctx.beginPath();
            ctx.arc(schip.lasers[i].x, schip.lasers[i].y, schip.r * 0.25, 0, Math.PI * 2, false);
            ctx.fill();
        }
    }

    
    if (textAlpha >= 0) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(255, 255, 255, " + textAlpha + ")";
        ctx.font = "small-caps " + text_grote + "px dejavu sans mono";
        ctx.fillText(text, canv.width / 2, canv.height * 0.75);
        textAlpha -= (1.0 / text_verdwijn_tijd / FPS);
    } else if (schip.dead) {
    
        nieuw_spel();
    }

    
    var lifeColour;
    for (var i = 0; i < levens; i++) {
        lifeColour = exploding && i == levens - 1 ? "red" : "white";
        teken_schip(schip_grote + i * schip_grote * 1.2, schip_grote, 0.5 * Math.PI, lifeColour);
    }

    
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = text_grote + "px dejavu sans mono";
    ctx.fillText(punten, canv.width - schip_grote / 2, schip_grote);

    
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = (text_grote * 0.75) + "px dejavu sans mono";
    ctx.fillText("BEST " + topscore, canv.width / 2, schip_grote);

    
    var ax, ay, ar, lx, ly;
    for (var i = kometen.length - 1; i >= 0; i--) {

    
        ax = kometen[i].x;
        ay = kometen[i].y;
        ar = kometen[i].r;

    
        for (var j = schip.lasers.length - 1; j >= 0; j--) {

    
            lx = schip.lasers[j].x;
            ly = schip.lasers[j].y;


            if (schip.lasers[j].explodeTime == 0 && afstand_tussen_punten(ax, ay, lx, ly) < ar) {


                breek_asrtoide(i);
                schip.lasers[j].explodeTime = Math.ceil(lazer_ontplof_tijd * FPS);
                break;
            }
        }
    }


    if (!exploding) {


        if (schip.blinkNum == 0 && !schip.dead) {
            for (var i = 0; i < kometen.length; i++) {
                if (afstand_tussen_punten(schip.x, schip.y, kometen[i].x, kometen[i].y) < schip.r + kometen[i].r) {
                    schip_explosie();
                    breek_asrtoide(i);
                    break;
                }
            }
        }


        schip.a += schip.rot;


        schip.x += schip.thrust.x;
        schip.y += schip.thrust.y;
    } else {

        schip.explodeTime--;


        if (schip.explodeTime == 0) {
            levens--;
            if (levens == 0) {
                gameOver();
            } else {
                schip = nieuw_schip();
            }
        }
    }


    if (schip.x < 0 - schip.r) {
        schip.x = canv.width + schip.r;
    } else if (schip.x > canv.width + schip.r) {
        schip.x = 0 - schip.r;
    }
    if (schip.y < 0 - schip.r) {
        schip.y = canv.height + schip.r;
    } else if (schip.y > canv.height + schip.r) {
        schip.y = 0 - schip.r;
    }


    for (var i = schip.lasers.length - 1; i >= 0; i--) {
        

        if (schip.lasers[i].dist > lazer_afstand * canv.width) {
            schip.lasers.splice(i, 1);
            continue;
        }


        if (schip.lasers[i].explodeTime > 0) {
            schip.lasers[i].explodeTime--;


            if (schip.lasers[i].explodeTime == 0) {
                schip.lasers.splice(i, 1);
                continue;
            }
        } else {

            schip.lasers[i].x += schip.lasers[i].xv;
            schip.lasers[i].y += schip.lasers[i].yv;


            schip.lasers[i].dist += Math.sqrt(Math.pow(schip.lasers[i].xv, 2) + Math.pow(schip.lasers[i].yv, 2));
        }


        if (schip.lasers[i].x < 0) {
            schip.lasers[i].x = canv.width;
        } else if (schip.lasers[i].x > canv.width) {
            schip.lasers[i].x = 0;
        }
        if (schip.lasers[i].y < 0) {
            schip.lasers[i].y = canv.height;
        } else if (schip.lasers[i].y > canv.height) {
            schip.lasers[i].y = 0;
        }
    }


    for (var i = 0; i < kometen.length; i++) {
        kometen[i].x += kometen[i].xv;
        kometen[i].y += kometen[i].yv;

 
        if (kometen[i].x < 0 - kometen[i].r) {
            kometen[i].x = canv.width + kometen[i].r;
        } else if (kometen[i].x > canv.width + kometen[i].r) {
            kometen[i].x = 0 - kometen[i].r
        }
        if (kometen[i].y < 0 - kometen[i].r) {
            kometen[i].y = canv.height + kometen[i].r;
        } else if (kometen[i].y > canv.height + kometen[i].r) {
            kometen[i].y = 0 - kometen[i].r
        }
    }
}