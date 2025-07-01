import { TaskService } from './services/task.service';
import { setTimeout } from 'node:timers/promises';
import * as p from '@clack/prompts';
import color from 'picocolors';
import chalkAnimation from 'chalk-animation';
import chalk from 'chalk';

const [, , command, ...args] = process.argv;

async function main() {
  console.clear();

  await setTimeout(1000);

  p.updateSettings({
    aliases: {
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
    },
  });

  p.intro(
    `${color.bgCyan(color.black(' to-do-cli '))}`
  );

  const action = await p.select({
    message: 'What would you like to do?',
    options: [
      { value: 'add', label: 'Add a task' },
      { value: 'edit', label: 'Edit a task' },
      {
        value: 'title',
        label: 'Search by title',
      },
      { value: 'list', label: 'List all tasks' },
      {
        value: 'complete',
        label: 'Complete a task',
      },
      { value: 'delete', label: 'Delete a task' },
      {
        value: 'deleteAll',
        label: 'Delete all tasks',
      },
    ],
  });

  switch (action) {
    case 'add': {
      const title = await p.text({
        message: 'Enter task title',
      });
      const priority = (await p.select({
        message: 'Select task priority',
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ],
      })) as string;
      if (typeof title !== 'string' || !title) {
        console.log('Provide a task title');
        process.exit(1);
      }
      const task = TaskService.addTask(
        title,
        priority
      );
      console.log(
        `   Task added: [${task.id}] ${task.title}`
      );
      break;
    }
    case 'list': {
      const tasks = TaskService.getAllTasks();
      if (tasks.length === 0) {
        console.log('Task list is empty');
      } else {
        tasks.forEach((task) => {
          console.log(
            `[${task.id}] ${
              task.completed ? '[x]' : '[ ]'
            } ${task.title}`
          );
        });
      }
      break;
    }
    case 'edit': {
      const id = Number(
        await p.text({
          message: 'Enter task ID to edit',
        })
      );
      if (!id) {
        console.log(
          'Specify the task ID to edit'
        );
        process.exit(1);
      }
      const task = TaskService.getTaskById(id);
      if (!task) {
        console.log(
          `Task with ID ${id} not found`
        );
        process.exit(1);
      }
      const newTitle = (await p.text({
        message: 'Enter new task title',
      })) as string;
      if (
        typeof newTitle !== 'string' ||
        !newTitle
      ) {
        console.log('Provide a new task title');
      }
      TaskService.editTask(id, newTitle);
      console.log(
        `   Task ${id} updated to: ${newTitle}`
      );
      break;
    }
    case 'title': {
      const title = await p.text({
        message: 'Enter task title to search',
      });
      if (typeof title !== 'string' || !title) {
        console.log(
          'Provide a task title to search'
        );
        process.exit(1);
      }
      const task =
        TaskService.getTaskByTitle(title);
      if (!task) {
        console.log(
          `Task with title "${title}" not found`
        );
        process.exit(1);
      }
      console.log(
        `   Task found: [${task.id}] ${
          task.title
        } ${task.completed ? '[x]' : '[ ]'}`
      );
      break;
    }
    case 'complete': {
      const id = Number(
        await p.text({
          message: 'Enter task ID to complete',
        })
      );
      if (!id) {
        console.log(
          'Specify the task ID to complete'
        );
        process.exit(1);
      }
      TaskService.completeTask(id);
      console.log(
        `   Task ${id} marked as completed`
      );
      const tasks = TaskService.getAllTasks();
      tasks.forEach((task) => {
        console.log(
          `[${task.id}] ${
            task.completed ? '[x]' : '[ ]'
          } ${task.title}`
        );
      });
      break;
    }
    case 'delete': {
      const id = Number(
        await p.text({
          message: 'Enter task ID to delete',
        })
      );
      if (!id) {
        console.log(
          'Specify the task ID to delete'
        );
        process.exit(1);
      }
      TaskService.deleteTask(id);
      console.log(`   Task ${id} deleted`);
      break;
    }
    case 'deleteAll': {
      const confirm = await p.confirm({
        message:
          'Are you sure you want to delete all tasks?',
        initialValue: false,
      });
      if (!confirm) {
        console.log('Operation cancelled');
        process.exit(0);
      }
      TaskService.deleteAllTasks();
      console.log('All tasks deleted');
      break;
    }
    default:
      return p.cancel(
        'Operation cancelled. Exiting...'
      );
  }
}

// async function welcome() {
//   const rainbowTitle =
//     chalkAnimation.rainbow('Hello \n');

//   await setTimeout(2000);
//   rainbowTitle.stop();

//   console.log(
//     `${chalk.bgBlue('Welcome to the To-Do CLI!')}`
//   );
// }

async function runApp() {
  // welcome();
  // await setTimeout(1000);
  main().catch(console.error);
}

runApp();
