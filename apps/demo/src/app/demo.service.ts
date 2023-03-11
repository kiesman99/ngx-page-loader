import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, take } from 'rxjs';

export type Todo = {
  id: number;
  title: string;
  done: boolean;
};

const defaultTodos: Todo[] = [
  // generate 70 todos
  ...Array.from({ length: 70 }, (_, i) => ({
    id: i,
    title: `Todo ${i}`,
    done: i % 3 === 0,
  })),
];

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  private index = 70;
  private readonly todosSubject$ = new BehaviorSubject<Todo[]>(defaultTodos);
  private readonly todos$ = this.todosSubject$.asObservable();

  loadTodos(delayMillis: number = 1): Observable<Todo[]> {
    return this.todos$.pipe(delay(delayMillis));
  }
  
  loadTodo(id: number, delayMillis: number = 200): Observable<Todo> {
    return this.todos$.pipe(
      delay(delayMillis),
      map((todos) => {
        const todo = todos.find((t) => t.id === id);

        if (!todo) {
          throw new Error(`Todo with id ${id} not found`);
        }
        
        console.log('found todo', todo);

        return todo;
      }),
      // take(1)
    );
  }

  toggleTodo(id: number, delayMillis: number = 1): Observable<Todo> {
    return this.todos$.pipe(
      delay(delayMillis),
      map((todos) => {
        const todo = todos.find((t) => t.id === id);

        if (!todo) {
          throw new Error(`Todo with id ${id} not found`);
        }

        const newTodo = { ...todo, done: !todo.done };
        const newTodos = todos.map((t) => (t.id === id ? newTodo : t));
        this.todosSubject$.next(newTodos);
        return todo;
      })
    );
  }

  addTodo(todo: Omit<Todo, 'id'>, delayMillis: number = 1): Observable<Todo> {
    return this.todos$.pipe(
      delay(delayMillis),
      take(1),
      map((todos) => {
        const newTodo = {
          id: ++this.index,
          ...todo,
        };
        this.todosSubject$.next([...todos, newTodo]);
        return newTodo;
      })
    );
  }
}
