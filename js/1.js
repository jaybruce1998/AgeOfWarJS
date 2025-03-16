function drawMan(xPos, yPos, step) {
	ctx.lineWidth = 1;

	// Head
	ctx.beginPath();
	ctx.arc(xPos, yPos - 30, 10, 0, Math.PI * 2);
	ctx.strokeStyle = "black";
	ctx.stroke();

	// Body
	ctx.beginPath();
	ctx.moveTo(xPos, yPos - 20);
	ctx.lineTo(xPos, yPos);
	ctx.stroke();

	// Arms (swing slightly)
	const armOffset = Math.sin(step) * 5;
	
	// Left arm (empty hand)
	ctx.beginPath();
	ctx.moveTo(xPos, yPos - 20);
	ctx.lineTo(xPos - 10, yPos - 20 - armOffset);
	ctx.stroke();

	// Right arm (holding club)
	ctx.beginPath();
	ctx.moveTo(xPos, yPos - 20);
	ctx.lineTo(xPos + 10, yPos - 20 + armOffset);
	ctx.stroke();

	// Legs (swing back and forth)
	const legOffset = Math.sin(step) * 10;
	ctx.beginPath();
	ctx.moveTo(xPos, yPos);
	ctx.lineTo(xPos + legOffset, yPos + 20);
	ctx.moveTo(xPos, yPos);
	ctx.lineTo(xPos - legOffset, yPos + 20);
	ctx.stroke();

	return armOffset;
}
function canMove(backwards, arrayPos, minX, maxX) {
	if (backwards) {
		if(minX<140)
			return false;
		if (arrayPos === 0)
		{
			if(playerTroops.length === 0) return true;
			return minX > playerTroops[0].maxX;
		}
		return minX > enemyTroops[arrayPos - 1].maxX;
	} else {
		if(maxX>1430)
			return false;
		if (arrayPos === 0) {
			if (enemyTroops.length === 0) return true;
			return maxX < enemyTroops[0].minX;
		}
		return maxX < playerTroops[arrayPos - 1].minX;
	}
}

function canAttack(backwards, minX, maxX, range)
{
	return backwards?playerTroops.length>0&&playerTroops[0].maxX+range>=minX||140+range>=minX:
			enemyTroops.length>0&&maxX+range>=enemyTroops[0].minX||maxX+range>=1430;
}

function killCheck(troops)
{
	if(troops[0].hp<=0)
	{
		const r=troops[0].reward;
		troops.shift();
		for(let i=0; i<troops.length; i++)
			troops[i].arrayPos=i;
		return r;
	}
	return 0;
}

class ClubMan {
    constructor(x, y, moveBackwards) {
        this.xPos = x;
        this.yPos = y;
        this.step = 0;
        this.moveBackwards = moveBackwards;
        this.stepSpeed = 0.1;
        this.f = 0;
        this.arrayPos = moveBackwards ? enemyTroops.length : playerTroops.length;
        this.minX = x - 10;
        this.maxX = x + 10;
        this.delta = moveBackwards ? -1 : 1;
		this.range = 0;
		this.hp=55;
		this.attack=16;
		this.nextAttackTime=1000;
		this.attackTime=1000;
		this.attacking=false;
		this.reward=20;
    }

    draw() {
        const { xPos, yPos, step, delta } = this;
        const armOffset = drawMan(xPos, yPos, step);

        // === Draw Oval Club ===
        ctx.beginPath();
        const clubX = xPos + 15 * delta;
        const clubY = yPos - 25 + armOffset * delta;
        const radiusX = 6;
        const radiusY = 12;
        const rotation = 0;
        const startAngle = 0;
        const endAngle = Math.PI * 2;
        ctx.ellipse(clubX, clubY, radiusX, radiusY, rotation, startAngle, endAngle);
        ctx.fillStyle = "brown";
        ctx.fill();
        ctx.stroke();
    }

    update() {
        if (this.f++ % 3 === 0) {
            this.step += this.stepSpeed;
            if(canMove(this.moveBackwards, this.arrayPos, this.minX, this.maxX)) {
                this.xPos += this.delta;
                this.minX += this.delta;
                this.maxX += this.delta;
				if(this.range==0)
				{
					this.attacking=false;
					return;
				}
				if(!this.attacking)
				{
					if(canAttack(this.moveBackwards, this.minX, this.maxX, this.range))
					{
						this.nextAttackTime=Date.now()+this.attackTime;
						this.attacking=true;
					}
					return;
				}
				if(Date.now()>=this.nextAttackTime)
				{
					this.attacking=false;
					const x=this.moveBackwards?this.minX:this.maxX;
					bullets.push(new Bullet(x, this.yPos, x+this.range*this.delta, this.yPos, this.attack));
				}
            }
			else if(this.arrayPos==0)
			{
				if(!this.attacking)
				{
					this.nextAttackTime=Date.now()+this.attackTime;
					this.attacking=true;
					return;
				}
				if(Date.now()>=this.nextAttackTime)
				{
					this.attacking=false;
					if(this.moveBackwards)
						if(playerTroops.length>0)
						{
							playerTroops[0].hp-=this.attack;
							xp+=Math.round(killCheck(playerTroops)/2);
							document.getElementById("xp").innerHTML=xp;
						}
						else
							base1hp-=this.attack;
					else if(enemyTroops.length>0)
					{
						enemyTroops[0].hp-=this.attack;
						const r=killCheck(enemyTroops);
						if(r>0)
						{
							cash+=r;
							xp+=r+r;
							document.getElementById("cash").innerHTML=cash;
							document.getElementById("xp").innerHTML=xp;
						}
					}
					else
						base2hp-=this.attack;
				}
			}
			else if(this.range>0)
			{
				if(!this.attacking)
				{
					if(canAttack(this.moveBackwards, this.minX, this.maxX, this.range))
					{
						this.nextAttackTime=Date.now()+this.attackTime;
						this.attacking=true;
					}
					return;
				}
				if(Date.now()>=this.nextAttackTime)
				{
					this.attacking=false;
					const x=this.moveBackwards?this.minX:this.maxX;
					bullets.push(new Bullet(x, this.yPos, x+this.range*this.delta, this.yPos, this.attack));
				}
			}
        }
    }
}