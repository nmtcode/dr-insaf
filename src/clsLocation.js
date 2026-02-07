class clsLocation {
    constructor(I, J) {
        this.I = I;
        this.J = J;
    }

    static NullLocation() {
        return new clsLocation(null, null);
    }

    MoveToNextIndexInRow() {
        this.J = (this.J === 4) ? 0 : this.J + 1;
    }

    MoveToNextIndexInColumn() {
        this.I = (this.I === 4) ? 0 : this.I + 1;
    }

    MoveToPreviousIndexInRow() {
        this.J = (this.J === 0) ? 4 : this.J - 1;
    }

    MoveToPreviousIndexInColumn() {
        this.I = (this.I === 0) ? 4 : this.I - 1;
    }
}