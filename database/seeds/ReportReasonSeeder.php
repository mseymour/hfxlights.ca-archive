<?php

use Illuminate\Database\Seeder;

class ReportReasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = now();
        $reasons = [
            [
                'name' => 'This is spam',
                'description' => 'This :kind contains spammy content or obvious advertising.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Other',
                'description' => 'This :kind doesn\'t match any other choices. Please elaborate under Comments.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];
        DB::table('reasons')->insert($reasons);
    }
}
