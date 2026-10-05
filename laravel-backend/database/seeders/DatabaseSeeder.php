<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Order;
use App\Models\Package;
use App\Models\Payment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Users
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $customer1 = User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        $customer2 = User::create([
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        $customer3 = User::create([
            'name' => 'Ali Ahmad',
            'email' => 'ali@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        // Packages

        $package1 = Package::create([
            'name' => 'Melur A',
            'detail' => '0123456789',
            'amount' => 350.00,
            'currency' => 'MYR'
        ]);

        $package2 = Package::create([
            'name' => 'Melur B',
            'detail' => '0123456789',
            'amount' => 400.00,
            'currency' => 'MYR'
        ]);


        // Orders
        $order1 = Order::create([
            'user_id' => $customer1->id,
            'package_id' => $package1->id,
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '0123456789',
            'location' => 'Puchong, Selangor',
        ]);

        $order2 = Order::create([
            'user_id' => $customer2->id,
            'package_id' => $package1->id,
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '0134567890',
            'location' => 'Subang Jaya, Selangor',
        ]);

        $order3 = Order::create([
            'user_id' => $customer3->id,
            'package_id' => $package2->id,
            'name' => 'Ali Ahmad',
            'email' => 'ali@example.com',
            'phone' => '0145678901',
            'location' => 'Shah Alam, Selangor',
        ]);

        // Guest order
        $order4 = Order::create([
            'user_id' => null,
            'package_id' => $package2->id,
            'name' => 'Guest Customer',
            'email' => 'guest@example.com',
            'phone' => '0167890123',
            'location' => 'Kuala Lumpur',
        ]);


        // Payments
        Payment::create([
            'order_id' => $order1->id,
            'user_id' => $customer1->id,
            'name' => 'John Doe',
            'phone' => '0123456789',
            'amount' => 350.00,
            'currency' => 'MYR',
            'status' => 'paid',
            'gateway' => 'ipay88',
            'method' => 'online_banking',
            'reference' => 'PAY-TEST-001',
            'gateway_transaction_id' => 'IPAY-TEST-001',
            'gateway_status' => '00',
            'gateway_message' => 'Payment successful',
            'paid_at' => now(),
        ]);

        Payment::create([
            'order_id' => $order2->id,
            'user_id' => $customer2->id,
            'name' => 'Jane Doe',
            'phone' => '0134567890',
            'amount' => 350.00,
            'currency' => 'MYR',
            'status' => 'paid',
            'gateway' => 'ipay88',
            'method' => 'online_banking',
            'reference' => 'PAY-TEST-002',
            'gateway_transaction_id' => 'IPAY-TEST-002',
            'gateway_status' => '00',
            'gateway_message' => 'Payment successful',
            'paid_at' => now(),
        ]);

        Payment::create([
            'order_id' => $order3->id,
            'user_id' => $customer3->id,
            'name' => 'Ali Ahmad',
            'phone' => '0145678901',
            'amount' => 400.00,
            'currency' => 'MYR',
            'status' => 'paid',
            'gateway' => 'ipay88',
            'method' => 'online_banking',
            'reference' => 'PAY-TEST-003',
            'gateway_transaction_id' => 'IPAY-TEST-003',
            'gateway_status' => '00',
            'gateway_message' => 'Payment successful',
            'paid_at' => now(),
        ]);

        // Guest payment
        Payment::create([
            'order_id' => $order4->id,
            'user_id' => null,
            'name' => 'Guest Customer',
            'phone' => '0167890123',
            'amount' => 400.00,
            'currency' => 'MYR',
            'status' => 'paid',
            'gateway' => 'ipay88',
            'method' => 'online_banking',
            'reference' => 'PAY-TEST-004',
            'gateway_transaction_id' => 'IPAY-TEST-004',
            'gateway_status' => '00',
            'gateway_message' => 'Payment successful',
            'paid_at' => now(),
        ]);
    }
}