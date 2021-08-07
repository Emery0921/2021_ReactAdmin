import React, { Component } from 'react'
import {Route,Switch} from 'react-router-dom'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default class App extends Component {
    render() {
        return (
            <div className='app'>
            <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/admin' component={Admin}/>
            </Switch>
            </div>

        )
    }
}
