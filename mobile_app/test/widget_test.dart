import 'package:flutter_test/flutter_test.dart';
import 'package:royal_bengal_app/main.dart';

void main() {
  testWidgets('Royal Bengal app smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const RoyalBengalApp());
    expect(find.text('ROYAL BENGAL'), findsWidgets);
  });
}
