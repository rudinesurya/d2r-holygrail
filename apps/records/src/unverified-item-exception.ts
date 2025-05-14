export class UnverifiedItemException extends Error {
    constructor(message) {
        super(message); 
        this.name = "UnverifiedItemError"; 
    }
  }