<?php

use App\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (App::environment('local')) {
            $u = User::create([
                'name' => env('LOCAL_USER_NAME') ?: $this->command->ask("Your name"),
                'email' => env('LOCAL_USER_EMAIL') ?: $this->command->ask("Your email"),
                'password' => bcrypt(env('LOCAL_USER_PASS') ?: $this->command->secret("Your password")),
            ]);
            $u->assignRole('admin');
        }
    }
}
