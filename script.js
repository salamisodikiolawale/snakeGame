window.onload = function()
{
	var canvasWidth = 900; //en px
	var canvasHeidth = 600;//en px
	var blockSize = 30;
	var ctx;
	var delay = 100;//1000// Délais de rafraichissement
	//var xCoord = 0;
	//var yCoord = 0;
	var Snakee;
	var Apple;
	var score;

	var widthInBlock = canvasWidth/blockSize; //en terme de block 900px/30 pour avoir en théorie le nombre de block dans le canvas en horizontal
	var heightInBlock = canvasHeidth/blockSize; //en terme de block 600px/30 pour avoir en théorie le nombre de block dans le canvas en vertical

	init();

	function init()
	{
		var canvas = document.createElement('canvas');
			canvas.width = canvasWidth;
			canvas.height = canvasHeidth;
			canvas.style.border = "1px solid";
		document.body.appendChild(canvas);

		//Dessiner dans le variable
		ctx = canvas.getContext('2d');//creer
		//initialisation
		Snakee = new Snake([[6,4], [5,4], [4,4]], "right");//Objet de type Snake
		apple = new Apple([10,10]);
		score = 0;
		refreshCanvas();
	}
		

	//Rafraichir le canvas
	function refreshCanvas()
	{	
		//xCoord += 5;
		//yCoord += 5;

		Snakee.advanced();
		if (Snakee.checkCollision()) 
		{
			//GAME OVER
			gameOver();
		}
		else
		{
			if (Snakee.isEatingApple(apple)) 
			{	
				score++;
				Snakee.ateApple = true;//le serpent vient de manger une pomme
				do
				{
					apple.setNewPosition();//Replace la pomme aleatoirement
				}
				while(apple.isOnSnake(Snakee));//Tant que la nouvelle position de la pomme generee est a la position du serpent alors on genere une autre position
			}

			ctx.clearRect(0,0,canvasWidth, canvasHeidth);
			ctx.fillStyle = "#ff0000";
			//ctx.fillRect(xCoord, yCoord, 100, 50);
			Snakee.draw();
			apple.draw();
			drawScore();
			setTimeout(refreshCanvas, delay);
		}
		
	}


	function gameOver()
	{
		ctx.save();
		ctx.fillText("Game Over", 5, 15);
		ctx.fillText("Appuyer sur la touche pour rejouer", 5, 30);
		ctx.restore();
	};

	function restart()
	{
		//init();
		Snakee = new Snake([[6,4], [5,4], [4,4]], "right");//Objet de type Snake
		apple = new Apple([10,10]);
		score = 0;
		refreshCanvas();
	};

	function drawScore()
	{
		ctx.save();
		ctx.fillText(score.toString(), 5, canvasHeidth - 5);
		ctx.restore();
	};

	function drawBlock(ctx, position)
	{
		var x = position[0] * blockSize;
		var y = position[1] * blockSize;
		ctx.fillRect(x, y, blockSize, blockSize);
	}

	//Prototype(Objet)
	function Snake(body, direction)
	{
		this.body = body;
		this.direction = direction;
		this.ateApple = false;
		this.draw = function()
					{
						ctx.save();//On sauvegarde l'état par défaut
						ctx.fillStyle = "#ff0000";
						for (var i = 0; i<this.body.length; i++) 
						{
							drawBlock(ctx, this.body[i]);
						}
						ctx.restore();//Restauration de l'etat
					};

		this.advanced = function()
						{
							//alert(this.body[0]);
							var nextPosition = this.body[0].slice();//Slice permet de copier le 1ier element
							//nextPosition[0] += 1;
							switch(this.direction)
							{
								case "left":
									nextPosition[0] -= 1;
									break;
								case "right":
									nextPosition[0] += 1;
									break;
								case "down":
									nextPosition[1] += 1;
									break;
								case "up":
									nextPosition[1] -= 1;
									break;
								default:
									throw("Invalide direction");
							}
							
							this.body.unshift(nextPosition);//Ajout le un nouvel elmnt au debut de tab body
							if (this.ateApple) 
								this.ateApple = false;
							else
								this.body.pop();//supprimer le dernier elmnt du tab body
							
						};

		this.setDirection = function(newDirection)
		{
			var allowedDirections;//Direction permise

			switch(this.direction)
			{
				case "left":
				case "right":
					allowedDirections = ["up", "down"];
					break;
				case "down":
				case "up":
					allowedDirections = ["left", "right"];
					break;
				default:
					throw("Invalide direction");
			}
			if (allowedDirections.indexOf(newDirection) > -1) 
			{
				this.direction = newDirection;
			}
		};

		this.checkCollision = function()
		{
			var wallCollision = false;
			var snakeCollision = false;
			var head = this.body[0];
			var rest = this.body.slice(1);//le reste du corps sans le premier elmnt c-a-d la tete
			var snakeX = head[0];
			var snakeY = head[1];
			var minX = 0;
			var minY = 0;
			var maxX = widthInBlock - 1;
			var maxY = heightInBlock - 1;
			var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;

			var isNotBetweenVerticalWalls   = snakeY < minY || snakeY > maxY;

			if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
			{
				wallCollision = true;
			}

			//Si la tête du serpent passe sur son propre corps
			for (var i = 0; i < rest.length; i++) 
			{
				if(snakeX === rest[i][0] && snakeY === rest[i][1])
				{
					snakeCollision = true;
				}
			}
			return wallCollision || snakeCollision;
		};

		this.isEatingApple = function(appleToEat)
		{
			var head = this.body[0];
			if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) 
				return true;
			else
				return false;
		};

	}

	//L'objet pomme
	function Apple(position)
	{
		this.position = position;
		//Déssiner notre pomme
		this.draw = function()
		{
			ctx.save();
			ctx.fillStyle = "#33cc33";
			ctx.beginPath();
			var  radius = blockSize/2; //rayon
			var  x = this.position[0] * blockSize + radius;//le x du block * par la taille du block pour avoir le pixel + radius pour être en milieu
			var  y = this.position[1] * blockSize + radius;
			ctx.arc(x,y, radius, 1.6, Math.PI=2.0, true);
			ctx.fill();
			ctx.restore();
		};

		//AVoir une position aleatoire de la pomme
		this.setNewPosition = function()
		{
			var newX = Math.round(Math.random()*(widthInBlock - 1));
			var newY = Math.round(Math.random()*(heightInBlock - 1));
			this.position = [newX, newY];
		};

		this.isOnSnake = function(snakeToCheck)
		{
			var isOnSnake = false;
			for (var i = 0; i < snakeToCheck.length; i++) 
			{
				if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) 
				{
					isOnSnake = true;
				}
			}
			return isOnSnake;
		};
	}


	document.onkeydown = function handleKeyDown(e)
	{
		var key = e.keyCode;
		var newDirection;

		switch(key)
		{
			case 37:
				newDirection = "left";
				break;
			case 38:
				newDirection = "up";
				break;
			case 39:
				newDirection = "right";
				break;
			case 40:
				newDirection = "down";
				break;
			case 32:
				restart();
				break;
			default:
				return;
		}	
		Snakee.setDirection(newDirection);
	}
	
}



