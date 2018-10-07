import React from 'react';
import './track.css';

class Track extends React.Component {
    constructor(props) {
        super(props)

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    renderAction() {
        if (this.props.isRemoval) {
            return <a className="Track-action" onClick={this.removeTrack}>-</a>;
        } else {
            return <a className="Track-action" onClick={this.addTrack}>+</a>;
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track)
    }

    removeTrack() {
        this.props.onRemove(this.props.track)
    }
    
    render() {
        return ( 
            <div className="Track">
                <div className="Track-information">
                    <div className="Track-box">
                        <div>
                            <h4>{this.props.track.name}</h4>
                            <p>{this.props.track.artist} | {this.props.track.album}</p>
                        </div>
                        <audio id="player" controls>
                            <source src={this.props.track.preview_url} type="audio/mpeg" />
                        </audio>
                    </div>
                </div>
                { this.props.isRemoval ? <a className="Track-action" onClick={this.removeTrack} >-</a> : <a className="Track-action" onClick={this.addTrack}>+</a> }
            </div>
        )
    }
}

export default Track;

  