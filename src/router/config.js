import {
    WeatherApp,
    TodoListApp
} from 'src/page';

const config = {
    routes: [
        {
            path: '/',
            exact: true,
            component: WeatherApp
        },
        {
            path: '/todolist',
            exact: true,
            component: TodoListApp
        }
    ]
};

export default config;