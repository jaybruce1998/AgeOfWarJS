let base1hp=500;
let base1maxHp=500;
let base2hp=500;
let base2maxHp=500;
let cash=175;
let xp=0;
let level=0, eLevel=0;
const tray=[];
let tFrames;
let turretSelected=-1;
let sellected=false;
const playerTroops=[];
const enemyTroops=[];
const pTurrets=[null];
const eTurrets=[null];
const addonCosts=[0, 1000, 3000, 7500];
const baseHealths=[500, 1100, 2000, 3200, 4700];
const evxp=[4000, 14000, 45000, 200000];
let specialTime=0;
let healEnd=0;
let sBul=[];

const troopNames=["Club Man", "Slingshot Man", "Dino Rider", "Sword Man", "Archer", "Knight", "Dueler", "Musketeer", "Canoneer",
					"Melee Infantry", "Melee Infantry", "Tank", "God's Blade", "Blaster", "War Machine", "Super Soldier"];
const troopCosts=[15, 25, 100, 50, 75, 500, 200, 400, 1000, 1500, 2000, 7000, 5000, 6000, 20000, 150000];
const troopTimes=[1000, 1000, 2500, 1750, 1250, 2500, 2500, 2500, 5000, 2500, 2500, 7500, 2500, 2500, 7500, 2500];

const turretNames=["Rock Slingshot", "Egg Automatic", "Primitive Catapult", "Catapult", "Fire Catapult", "Oil",
					"Small Cannon", "Medium Cannon", "Large cannon", "Gun", "Rocket Launcher", "Double Gun", "Laser", "Titanium Shooter", "Ion Ray"];
const turretCosts=[100, 200, 500, 500, 750, 1000, 1500, 3000, 6000, 7000, 9000, 14000, 24000, 40000, 100000];
const turretHeights=[canvas.height-133, canvas.height-175, canvas.height-217, canvas.height-259];
const turretSpeeds=[800, 250, 1370, 2470, 2470, 1920, 1120, 2000, 2000, 1120, 1000, 500, 1000, 250, 250];
const turretDamages=[12, 5, 25, 40, 50, 125, 30, 70, 100, 70, 100, 60, 100, 40, 60];
const turretRanges=[350, 300, 380, 400, 300, 50, 500, 500, 500, 500, 500, 500, 400, 500, 550];

function spawnUnit(id, x, y, moveBackwards = false) {
	let newUnit;
	switch(id)
	{
		case 0:
			newUnit = new ClubMan(x, y, moveBackwards);
			break;
		case 1:
			newUnit = new SlingshotMan(x, y, moveBackwards);
			break;
		case 2:
			newUnit = new DinoRider(x, y, moveBackwards);
			break;
		case 3:
			newUnit = new SwordMan(x, y, moveBackwards);
			break;
		case 4:
			newUnit = new Archer(x, y, moveBackwards);
			break;
		case 5:
			newUnit = new Knight(x, y, moveBackwards);
			break;
		case 6:
			newUnit = new Dueler(x, y, moveBackwards);
			break;
		case 7:
			newUnit = new Musketeer(x, y, moveBackwards);
			break;
		case 8:
			newUnit = new Cannoneer(x, y, moveBackwards);
			break;
		case 9:
			newUnit = new MeleeInfantry(x, y, moveBackwards);
			break;
		case 10:
			newUnit = new Infantry(x, y, moveBackwards);
			break;
		case 11:
			newUnit = new Tank(x, y, moveBackwards);
			break;
		case 12:
			newUnit = new GodsBlade(x, y, moveBackwards);
			break;
		case 13:
			newUnit = new Blaster(x, y, moveBackwards);
			break;
		case 14:
			newUnit = new WarMachine(x, y, moveBackwards);
			break;
		case 15:
			newUnit = new SuperSoldier(x, y, moveBackwards);
			break;
	}
	if(moveBackwards)
		enemyTroops.push(newUnit);
	else
		playerTroops.push(newUnit);
}

function updateTroops(troops)
{
	troops.forEach(unit => {
        unit.update();       // Update each unit's position
        unit.draw();         // Draw each unit
    });
}

function updateTray()
{
	if(tray.length>0&&Date.now()>=tFrames)
	{
		spawnUnit(parseInt(tray.shift()), 100, canvas.height-75, false);
		if(tray.length>0)
			tFrames=Date.now()+troopTimes[tray[0]];
	}
}

function buyUnit(id)
{
	if(level<4&&id==3)
		return;
	id=+id+level*3;
	if(cash>=troopCosts[id]&&tray.length<5)
	{
		cash-=troopCosts[id];
		document.getElementById("cash").innerHTML=cash;console.log(cash);
		tFrames=Date.now()+troopTimes[id];
		tray.push(id);console.log("My tray: "+tray);
	}
}

function selectTurret(id)
{
	id=+id.substring(1)+level*3;
	if(cash>=turretCosts[id])
	{
		sellected=false;
		turretSelected=id;
		for(let i=0; i<pTurrets.length; i++)
			if(pTurrets[i]==null)
				document.getElementById("sel"+i).src="buttons/turretSelect.png";
	}
}

function startSelling()
{
	sellected=true;
	for(let i=0; i<pTurrets.length; i++)
		if(pTurrets[i]!=null)
			document.getElementById("sel"+i).src="buttons/turretSelect.png";
}

function sell(id)
{
	id=id.substring(3);
	if(sellected&&pTurrets[id]!=null)
	{
		sellected=false;
		cash+=turretCosts[pTurrets[id].id]/2;
		pTurrets[id]=null;
		document.getElementById("cash").innerHTML=cash;
		document.getElementById("tur"+id).src="";
		for(let i=0; i<pTurrets.length; i++)
			document.getElementById("sel"+i).src="";
	}
}

function selectSlot(id)
{
	id=id.substring(3);
	if(turretSelected>=0&&id<pTurrets.length&&pTurrets[id]==null)
	{
		pTurrets[id]=new Turret(turretSelected, 100, turretHeights[id], turretSpeeds[turretSelected], turretDamages[turretSelected], turretRanges[turretSelected]);
		document.getElementById("tur"+id).src="sprites/turrets/"+turretSelected+".png";
		for(let i=0; i<pTurrets.length; i++)
			document.getElementById("sel"+i).src="";
		cash-=turretCosts[turretSelected];
		document.getElementById("cash").innerHTML=cash;
		turretSelected=-1;
	}
}

function addSpot()
{
	if(pTurrets.length==4||addonCosts[pTurrets.length]>cash)
		return;
	cash-=addonCosts[pTurrets.length];
	document.getElementById("cash").innerHTML=cash;
	document.getElementById("spot"+pTurrets.length).src="sprites/spot2/"+level+".png";
	pTurrets.push(null);
}

function evolve()
{
	if(level<4&&xp>=evxp[level])
	{
		base1hp+=baseHealths[++level]-base1maxHp;
		base1maxHp=baseHealths[level];
		document.getElementById("base1").src="sprites/bases/"+level+".png";
		for(let i=1; i<pTurrets.length; i++)
			document.getElementById("spot"+i).src="sprites/spot2/"+level+".png";
		for(let i=0; i<3; i++)
		{
			document.getElementById(i).src="buttons/troops/"+(i+level*3)+".png";
			document.getElementById("t"+i).src="buttons/turrets/"+(i+level*3)+".png";
		}
		if(level==4)
			document.getElementById(3).src="buttons/troops/15.png";
		document.getElementById("special").src="buttons/specials/"+level+".png"
	}
}

function updateTurrets(turrets)
{
	turrets.forEach(t=>{
		if(t!=null)
		{
			t.update();
			//t.draw();
		}
	});
}

function useSpecial()
{
	if(Date.now()>=specialTime)
	{
		specialTime=Date.now()+50000;
		const t=Date.now();
		switch(level)
		{
			case 0:
				for(let i=0; i<22; i++)
					sBul.push({'damage': 200, 'x': Math.random()*1300+100, 'y': 0, 'time': t+i*219});
				break;
			case 1:
				for(let i=0; i<40; i++)
					sBul.push({'damage': 200, 'x': Math.random()*1300+100, 'y': 0, 'time': t+i*121});
				break;
			case 2:
				healEnd=t+14600;
				break;
			case 3:
				for(let i=0; i<15; i++)
					sBul.push({'damage': 400, 'x': Math.random()*1300+100, 'y': 0, 'time': t+i*365});
				break;
			default:
				for(let i=0; i<18; i++)
					sBul.push({'damage': 1000, 'x': Math.random()*1300, 'y': 0, 'time': t+i*121});
		}
	}
}

function drawHpBar(x, y, width, height, hp, maxHp) {
    // Background (empty part of the bar)
    ctx.fillStyle = 'gray';
    ctx.fillRect(x, y, width, height);
    
    // Filled part based on hp/maxHp
    let fillHeight = height * (hp / maxHp);
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y + (height - fillHeight), width, fillHeight);
    
    // Black border
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Red number showing HP
    ctx.fillStyle = 'red';
    ctx.font = '16px Arial';
    ctx.fillText(hp, x + width + 5, y + height / 2 + 5);
}

function drawTrayBar(x, y, width, height)
{
    // Background (empty part of the bar)
    ctx.fillStyle = 'orange';
    ctx.fillRect(x, y, width, height);
    
    let fillWidth = tray.length>0?width * (tFrames-Date.now())/troopTimes[tray[0]]:0;
    ctx.fillStyle = 'grey';
    ctx.fillRect(x, y, fillWidth, height);
    
    // Black border
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
	for(let i=0; i<5; i++)
	{
		ctx.fillStyle = i<tray.length?"grey":'orange';
		ctx.fillRect(x+i*25, y+25, 20, height);
	}
}

function doOneFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
	eUpdate();
    updateTroops(playerTroops);
	if(Date.now()<healEnd)
		playerTroops.forEach(t=>t.hp++);
	updateTroops(enemyTroops);
	updateTray();
	updateTurrets(pTurrets);
	updateTurrets(eTurrets);
	if(sBul.length>0&&sBul[0].time<=Date.now())
	{
		const b=sBul.shift();
		bullets.push(new Bullet(b.x, b.y, b.x+100, canvas.height, b.damage));
	}
	updateTroops(bullets);
	bullets=bullets.filter(b=>!b.hit);
	drawHpBar(0, 250, 20, 100, base1hp, base1maxHp);
	drawHpBar(1450, 250, 20, 100, base2hp, base2maxHp);
	drawTrayBar(500, 0, 100, 20);
    requestAnimationFrame(doOneFrame); // Keep updating
}
doOneFrame();