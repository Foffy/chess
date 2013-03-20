// check if a move is legal
function checkLegalMove(piece, position, colour){

	// check pawn move
	if(piece.type = "pawn"){

		// if pawn has moved before
		if(piece.hasMoved){

			// if pawn is white
			if(colour == "white"){
				if(position[1] == piece.pos[1]-1 && position[0] == piece.pos[0] && board[position[0]][position[1]].length == 0){
					return true;
				}
				else if(position[1] == piece.pos[1]-1 && position[0] == piece.pos[0]-1 && board[position[0]][position[1]].length != 0){
					return true;
				}
				else if(position[1] == piece.pos[1]-1 && position[0] == piece.pos[0]+1 && board[position[0]][position[1]].length != 0){
					return true;
				}

			// if pawn is black
			}else{
				if(position[1] == piece.pos[1]+1 && position[0] == piece.pos[0] && board[position[0]][position[1]].length == 0){
					return true;
				}
				else if(position[1] == piece.pos[1]+1 && position[0] == piece.pos[0]-1 && board[position[0]][position[1]].length != 0){
					return true;
				}
				else if(position[1] == piece.pos[1]+1 && position[0] == piece.pos[0]+1 && board[position[0]][position[1]].length != 0){
					return true;
				}
			}

		// if this is the first time for pawn to move
		}else{
			if(colour == "white"){
				if(position[1] == piece.pos[1]-1 && position[0] == piece.pos[0] && board[position[0]][position[1]].length == 0){
					return true;
				}
				else if(position[1] == piece.pos[1]-2 && position[0] == piece.pos[0] && board[position[0]][position[1]].length == 0){
					return true;
				}
				else if(position[1] == piece.pos[1]-1 && position[0] == piece.pos[0]-1 && board[position[0]][position[1]].length != 0){
					return true;
				}
				else if(position[1] == piece.pos[1]-1 && position[0] == piece.pos[0]+1 && board[position[0]][position[1]].length != 0){
					return true;
				}
			}else{

				if(position[1] == piece.pos[1]+1 && position[0] == piece.pos[0] && board[position[0]][position[1]].length == 0){
					return true;
				}
				else if(position[1] == piece.pos[1]+2 && position[0] == piece.pos[0] && board[position[0]][position[1]].length == 0){
					return true;
				}
				else if(position[1] == piece.pos[1]+1 && position[0] == piece.pos[0]+1 && board[position[0]][position[1]].length != 0){
					return true;
				}
				else if(position[1] == piece.pos[1]+1 && position[0] == piece.pos[0]-1 && board[position[0]][position[1]].length != 0){
					return true;
				}
			}
		}
	}
}