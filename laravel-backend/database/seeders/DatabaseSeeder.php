<?php

namespace Database\Seeders;

use App\Models\Document as ModelsDocument;
use App\Models\User;
use App\Models\Order;
use App\Models\Package;
use App\Models\Payment;
use Dom\Document;
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
            'name' => 'Mini Pelamin Melur',
            'detail' => 'Design pelamin kami yang paling simple. Kiri dan kanan dihias bunga putih. Sesuai untuk orang yang memang betul-betul minimalis.',
            'amount' => 350.00,
            'currency' => 'MYR',
            'popular' => false
        ]);

        $package2 = Package::create([
            'name' => 'Mini Pelamin Mawar',
            'detail' => 'Pakej paling popular kami. Hijau yang mengelilingi kerusi beserta jambakan bunga-bunga berwarna. Client kata nampak happening!',
            'amount' => 400.00,
            'currency' => 'MYR',
            'popular' => true
        ]);

        $package3 = Package::create([
            'name' => 'Mini Pelamin Kasturi',
            'detail' => 'Macam icecream, itu yang pelanggan kami kata. Kombinasi biru dan putih ini memang nampak sangat sweet dan lembut.',
            'amount' => 300.00,
            'currency' => 'MYR',
            'popular' => false
        ]);

        $package4 = Package::create([
            'name' => 'Mini Pelamin Ros',
            'detail' => 'Nak romantis. Kaler merah lah paling kena. Kombinasi merah dan putih. Untuk design boleh samaada hanya di side atau full mengelilingi kerusi',
            'amount' => 300.00,
            'currency' => 'MYR',
            'popular' => false
        ]);


        // Orders
        $order1 = Order::create([
            'user_id' => $customer1->id,
            'package_id' => $package1->id,
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '0123456789',
            'location' => 'Puchong, Selangor',
            'amount' => 350.00,
            'status' => 'done',
            'date' => today()
        ]);

        $order2 = Order::create([
            'user_id' => $customer2->id,
            'package_id' => $package1->id,
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '0134567890',
            'location' => 'Subang Jaya, Selangor',
            'amount' => 350.00,
            'status' => 'done',
            'date' => today()
        ]);

        $order3 = Order::create([
            'user_id' => $customer3->id,
            'package_id' => $package2->id,
            'name' => 'Ali Ahmad',
            'email' => 'ali@example.com',
            'phone' => '0145678901',
            'location' => 'Shah Alam, Selangor',
            'amount' => 400.00,
            'status' => 'done',
            'date' => today()
        ]);

        // Guest order
        // $order4 = Order::create([
        //     'user_id' => null,
        //     'package_id' => $package2->id,
        //     'name' => 'Guest Customer',
        //     'email' => 'guest@example.com',
        //     'phone' => '0167890123',
        //     'location' => 'Kuala Lumpur',
        //     'amount' => 400.00,
        // ]);


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
            'amount' => 200.00,
            'currency' => 'MYR',
            'status' => 'paid',
            'gateway' => 'ipay88',
            'method' => 'online_banking',
            'reference' => 'deposit',
            'gateway_transaction_id' => 'IPAY-TEST-003',
            'gateway_status' => '00',
            'gateway_message' => 'Payment successful',
            'paid_at' => now(),
        ]);

        // Guest payment
        Payment::create([
            'order_id' => $order3->id,
            'user_id' => null,
            'name' => 'Guest Customer',
            'phone' => '0167890123',
            'amount' => 200.00,
            'currency' => 'MYR',
            'status' => 'paid',
            'gateway' => 'ipay88',
            'method' => 'online_banking',
            'reference' => 'balance',
            'gateway_transaction_id' => 'IPAY-TEST-004',
            'gateway_status' => '00',
            'gateway_message' => 'Payment successful',
            'paid_at' => now(),
        ]);

        ModelsDocument::create([
            'package_id' => 1,
            'order_id' => null,
            'payment_id' => null,
            'disk' => 'public',
            'path' => 'documents/side.jpeg',
            'original_name' => 'side.jpeg',
            'mime_type' => 'image/png',
            'size' => 150000,
        ]);

        ModelsDocument::create([
            'package_id' => 2,
            'order_id' => null,
            'payment_id' => null,
            'disk' => 'public',
            'path' => 'documents/full.jpeg',
            'original_name' => 'full.jpeg',
            'mime_type' => 'image/png',
            'size' => 150000,
        ]);

        ModelsDocument::create([
            'package_id' => 3,
            'order_id' => null,
            'payment_id' => null,
            'disk' => 'public',
            'path' => 'documents/blue.jpeg',
            'original_name' => 'blue.jpeg',
            'mime_type' => 'image/png',
            'size' => 150000,
        ]);

        ModelsDocument::create([
            'package_id' => 4,
            'order_id' => null,
            'payment_id' => null,
            'disk' => 'public',
            'path' => 'documents/red.jpeg',
            'original_name' => 'red.jpeg',
            'mime_type' => 'image/png',
            'size' => 150000,
        ]);

        ModelsDocument::create([
            'package_id' => null,
            'order_id' => 1,
            'payment_id' => null,
            'disk' => 'public',
            'path' => 'documents/order-1.png',
            'original_name' => 'order-1.png',
            'mime_type' => 'image/png',
            'size' => 200000,
        ]);

        ModelsDocument::create([
            'package_id' => null,
            'order_id' => null,
            'payment_id' => 1,
            'disk' => 'public',
            'path' => 'documents/payment-1.pdf',
            'original_name' => 'payment-1.pdf',
            'mime_type' => 'application/pdf',
            'size' => 180000,
        ]);
    }
}