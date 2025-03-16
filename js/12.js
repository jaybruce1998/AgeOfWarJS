class Tank {
    constructor(x, y, moveBackwards) {
		this.xPos = x;
		this.yPos = y;
		this.step = 0;
		this.moveBackwards = moveBackwards;
		this.stepSpeed = 0.1;
		this.f = 0;
		this.arrayPos=moveBackwards?enemyTroops.length:playerTroops.length;
		this.minX=x-40;
		this.maxX=x+40;
		this.delta=moveBackwards?-1:1;
		this.range = 0;
		this.hp=1200;
		this.attack=300;
		this.nextAttackTime=1000;
		this.attackTime=1570;
		this.attacking=false;
		this.reward=9100;
    }

    draw() {
        const { xPos, yPos, step } = this;

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        // === Tank Body ===
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.rect(xPos - 25, yPos - 15, 50, 30); // Main body
        ctx.fill(); // Fill with green
        ctx.stroke();

        // === Tank Tracks ===
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.rect(xPos - 25, yPos + 10, 10, 5); // Left track
        ctx.rect(xPos + 15, yPos + 10, 10, 5); // Right track
        ctx.fill(); // Fill the tracks

        // === Tank Turret ===
        ctx.fillStyle = "darkgreen";
        ctx.beginPath();
        ctx.rect(xPos - 10, yPos - 25, 20, 15); // Turret
        ctx.fill(); // Fill the turret
        ctx.stroke();

        // === Tank Barrel (Cannon) ===
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(xPos, yPos - 25); // Turret center
        ctx.lineTo(xPos + 40*this.delta, yPos - 25); // Cannon barrel
        ctx.stroke();

        // === Tank Movement ===
        const trackOffset = Math.sin(step) * 2; // Track movement effect
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.rect(xPos - 25 + trackOffset, yPos + 10, 10, 5); // Left track movement
        ctx.rect(xPos + 15 - trackOffset, yPos + 10, 10, 5); // Right track movement
        ctx.fill();
    }

    canMove() {
        return this.moveBackwards
            ? playerTroops.length === 0
                ? true
                : this.arrayPos === 0
                    ? this.minX > playerTroops[0].maxX
                    : this.minX > enemyTroops[this.arrayPos - 1].maxX
            : this.arrayPos === 0
                ? enemyTroops.length === 0
                    ? true
                    : this.maxX < enemyTroops[0].minX
                : this.maxX < playerTroops[this.arrayPos - 1].minX;
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